#!/usr/bin/env python3
from __future__ import annotations

import json
import os
import urllib.request
from datetime import datetime, timedelta, timezone
from pathlib import Path

USERNAME = "juanmanueltorres-creator"
API = "https://api.github.com"


def _request_json(url: str, token: str) -> object:
    req = urllib.request.Request(
        url,
        headers={
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {token}",
            "X-GitHub-Api-Version": "2022-11-28",
            "User-Agent": "profile-stats-action",
        },
    )
    with urllib.request.urlopen(req, timeout=30) as response:
        return json.load(response)


def _parse_github_timestamp(value: object) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc)


def _summarize_public_repos(
    repos: list[dict], now: datetime | None = None
) -> dict[str, int | str]:
    current = now or datetime.now(timezone.utc)
    cutoff = current - timedelta(days=90)
    active_owned_repos_90 = 0
    pushed_at: list[datetime] = []

    for repo in repos:
        if repo.get("fork"):
            continue
        pushed = _parse_github_timestamp(repo.get("pushed_at"))
        if pushed is None:
            continue
        pushed_at.append(pushed)
        if pushed >= cutoff:
            active_owned_repos_90 += 1

    last_public_push = max(pushed_at).date().isoformat() if pushed_at else "—"
    return {
        "active_owned_repos_90": active_owned_repos_90,
        "last_public_push": last_public_push,
    }


def _count_commits_last_365(token: str, repos: list[dict]) -> int:
    since = (datetime.now(timezone.utc) - timedelta(days=365)).isoformat()
    total = 0
    for repo in repos:
        if repo.get("fork"):
            continue
        name = repo.get("name")
        if not name:
            continue
        page = 1
        while True:
            url = (
                f"{API}/repos/{USERNAME}/{name}/commits"
                f"?author={USERNAME}&since={since}&per_page=100&page={page}"
            )
            try:
                items = _request_json(url, token)
            except Exception:
                break
            if not isinstance(items, list):
                break
            total += len(items)
            if len(items) < 100:
                break
            page += 1
    return total


def fetch_stats(token: str) -> dict[str, int | str]:
    user = _request_json(f"{API}/users/{USERNAME}", token)
    repos = _request_json(
        f"{API}/users/{USERNAME}/repos?type=owner&sort=updated&per_page=100", token
    )

    public_repos = repos if isinstance(repos, list) else []
    repo_summary = _summarize_public_repos(public_repos)

    return {
        "followers": int(user.get("followers", 0)),
        "public_repos": int(user.get("public_repos", 0)),
        "active_owned_repos_90": int(repo_summary["active_owned_repos_90"]),
        "own_public_commits_365": _count_commits_last_365(token, public_repos),
        "last_public_push": str(repo_summary["last_public_push"]),
    }


def render_svg(stats: dict[str, int | str]) -> str:
    values = [
        ("FOLLOWERS", str(stats["followers"])),
        ("PUBLIC REPOS", str(stats["public_repos"])),
        ("ACTIVE OWN REPOS · 90D", str(stats["active_owned_repos_90"])),
        ("OWN PUBLIC COMMITS · 365D", str(stats["own_public_commits_365"])),
        ("LAST PUBLIC PUSH", str(stats["last_public_push"])),
    ]
    xs = [115, 330, 545, 780, 1000]
    blocks = []
    for (label, value), x in zip(values, xs):
        blocks.append(
            f'''  <g text-anchor="middle">
    <text x="{x}" y="108" class="value">{value}</text>
    <text x="{x}" y="139" class="label">{label}</text>
  </g>'''
        )

    return f'''<svg xmlns="http://www.w3.org/2000/svg" width="1100" height="190" viewBox="0 0 1100 190" role="img" aria-labelledby="title desc">
  <title id="title">Juan Manuel Torres — automated public GitHub player stats</title>
  <desc id="desc">Public GitHub activity metrics generated inside the profile repository by GitHub Actions.</desc>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#080706"/>
      <stop offset=".55" stop-color="#0d0b08"/>
      <stop offset="1" stop-color="#120907"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#5b4027"/>
      <stop offset=".5" stop-color="#d0ad6c"/>
      <stop offset="1" stop-color="#5b4027"/>
    </linearGradient>
    <style>
      .kicker {{ fill:#b99a63; font:700 10px "Courier New", monospace; letter-spacing:2.6px; }}
      .value {{ fill:#f0e6d4; font:700 26px "Palatino Linotype","Book Antiqua",Georgia,serif; }}
      .label {{ fill:#8f8171; font:700 9px "Courier New", monospace; letter-spacing:1.15px; }}
      .foot {{ fill:#675b4d; font:9px "Courier New", monospace; letter-spacing:1.4px; }}
    </style>
  </defs>
  <rect width="1100" height="190" rx="15" fill="url(#bg)" stroke="#30251b"/>
  <rect x="8" y="8" width="1084" height="174" rx="11" fill="none" stroke="#211a14"/>
  <text x="36" y="34" class="kicker">PLAYER STATS · PUBLIC GITHUB SIGNAL</text>
  <line x1="36" y1="54" x2="1064" y2="54" stroke="url(#gold)" stroke-width="1.2" opacity=".65"/>
{chr(10).join(blocks)}
  <line x1="36" y1="158" x2="1064" y2="158" stroke="#3e3022" stroke-width="1"/>
  <text x="550" y="176" text-anchor="middle" class="foot">PUBLIC OWNED REPOS · REFRESHES EVERY 6H · GITHUB API</text>
</svg>'''


def main() -> None:
    token = os.environ.get("GITHUB_TOKEN")
    if not token:
        raise SystemExit("GITHUB_TOKEN is required")
    stats = fetch_stats(token)
    output = Path("assets/player-stats.svg")
    output.parent.mkdir(parents=True, exist_ok=True)
    output.write_text(render_svg(stats), encoding="utf-8")
    print(json.dumps(stats, indent=2))


if __name__ == "__main__":
    main()
