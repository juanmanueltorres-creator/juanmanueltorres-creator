import sys
import unittest
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from scripts import profile_stats


class ProfileStatsTests(unittest.TestCase):
    def test_summarizes_active_owned_repos_and_last_public_push(self):
        now = datetime(2026, 8, 28, 12, 0, tzinfo=timezone.utc)
        repos = [
            {"fork": False, "pushed_at": "2026-08-28T10:00:00Z"},
            {"fork": False, "pushed_at": "2026-07-01T10:00:00Z"},
            {"fork": False, "pushed_at": "2026-01-01T10:00:00Z"},
            {"fork": True, "pushed_at": "2026-08-27T10:00:00Z"},
        ]

        summary = profile_stats._summarize_public_repos(repos, now=now)

        self.assertEqual(summary["active_owned_repos_90"], 2)
        self.assertEqual(summary["last_public_push"], "2026-08-28")

    def test_render_svg_uses_precise_public_activity_labels(self):
        svg = profile_stats.render_svg(
            {
                "followers": 59,
                "public_repos": 4,
                "active_owned_repos_90": 3,
                "own_public_commits_365": 72,
                "last_public_push": "2026-08-28",
            }
        )

        self.assertIn("ACTIVE OWN REPOS · 90D", svg)
        self.assertIn("OWN PUBLIC COMMITS · 365D", svg)
        self.assertIn("LAST PUBLIC PUSH", svg)
        self.assertNotIn("OWNED STARS", svg)
        self.assertNotIn("LAST SHIP", svg)


if __name__ == "__main__":
    unittest.main()
