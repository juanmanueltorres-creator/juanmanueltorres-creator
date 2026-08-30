import {readFileSync} from 'node:fs';
import {describe, expect, it} from 'vitest';
import {THEME} from '../shared/theme';

const SCENE_FILES = [
  '01-cover.tsx',
  '02-geoplatform.tsx',
  '03-pulso.tsx',
  '04-anti-ia.tsx',
  '05-fleetflow.tsx',
  '06-atlas.tsx',
  '07-more-systems.tsx',
] as const;

describe('motion reel visual contract', () => {
  it('uses the portrait social canvas contract', () => {
    expect(THEME.canvas).toEqual({width: 1080, height: 1350, fps: 25});
  });

  it('makes the product screenshot the dominant visual', () => {
    expect(THEME.space.screenshotWidth).toBe(THEME.space.contentWidth);
    expect(THEME.space.screenshotHeight).toBeGreaterThanOrEqual(550);
    expect(THEME.space.screenshotY).toBe(35);
    expect(THEME.space.captionY).toBeGreaterThan(
      THEME.space.screenshotY + THEME.space.screenshotHeight / 2 + 40,
    );
  });

  it('does not treat canvas edge coordinates as text-box centers', () => {
    for (const filename of SCENE_FILES) {
      const source = readFileSync(
        new URL(`../scenes/${filename}`, import.meta.url),
        'utf8',
      );

      expect(source, filename).not.toContain('x={-468}');
      expect(source, filename).not.toContain('x={468}');
    }
  });
});
