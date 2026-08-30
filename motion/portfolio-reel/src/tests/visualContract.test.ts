import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoplatformSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';
import {THEME} from '../shared/theme';

const PROJECT_SCENES = [
  ['02-geoplatform.tsx', geoplatformSource],
  ['03-pulso.tsx', pulsoSource],
  ['04-anti-ia.tsx', antiIaSource],
  ['05-fleetflow.tsx', fleetflowSource],
  ['06-atlas.tsx', atlasSource],
] as const;

const ALL_SCENES = [
  ['01-cover.tsx', coverSource],
  ...PROJECT_SCENES,
  ['07-more-systems.tsx', moreSystemsSource],
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

  it('uses flex Layout containers instead of absolute edge anchoring', () => {
    for (const [filename, source] of ALL_SCENES) {
      expect(source, filename).toContain('<Layout');
      expect(source, filename).not.toContain('left={[');
      expect(source, filename).not.toContain('right={[');
      expect(source, filename).not.toContain('leftAlignedCenterX');
      expect(source, filename).not.toContain('rightAlignedCenterX');
    }
  });

  it('lays out project name and status as one space-between header row', () => {
    for (const [filename, source] of PROJECT_SCENES) {
      expect(source, filename).toContain("justifyContent={'space-between'}");
      expect(source, filename).toContain("alignItems={'center'}");
    }
  });

  it('lays out Cover and More Systems editorial copy in start-aligned columns', () => {
    expect(coverSource).toContain("direction={'column'}");
    expect(coverSource).toContain("alignItems={'start'}");
    expect(moreSystemsSource).toContain("direction={'column'}");
    expect(moreSystemsSource).toContain("alignItems={'start'}");
  });

  it('keeps More Systems content visible independently of timeline reveals', () => {
    expect(moreSystemsSource).not.toContain('opacity={0}');
    expect(moreSystemsSource).not.toContain('revealText(');
  });
});
