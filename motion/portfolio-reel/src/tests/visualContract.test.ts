import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoplatformSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';
import {
  leftAlignedCenterX,
  rightAlignedCenterX,
} from '../shared/layout';
import {THEME} from '../shared/theme';

const SCENE_SOURCES = [
  ['01-cover.tsx', coverSource],
  ['02-geoplatform.tsx', geoplatformSource],
  ['03-pulso.tsx', pulsoSource],
  ['04-anti-ia.tsx', antiIaSource],
  ['05-fleetflow.tsx', fleetflowSource],
  ['06-atlas.tsx', atlasSource],
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

  it('centers left and right aligned boxes from the content edges', () => {
    expect(leftAlignedCenterX(936)).toBe(0);
    expect(leftAlignedCenterX(900)).toBe(-18);
    expect(leftAlignedCenterX(850)).toBe(-43);
    expect(rightAlignedCenterX(420)).toBe(258);
    expect(rightAlignedCenterX(460)).toBe(238);
  });

  it('does not treat canvas edge coordinates as text-box centers', () => {
    for (const [filename, source] of SCENE_SOURCES) {
      expect(source, filename).not.toContain('x={-468}');
      expect(source, filename).not.toContain('x={468}');
    }
  });
});
