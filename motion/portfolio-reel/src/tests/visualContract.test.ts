import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoplatformSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';
import techIconSource from '../shared/components/TechIcon.tsx?raw';
import {MOTION} from '../shared/motion';
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

  it('keeps the open editorial spacing contract', () => {
    expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
    expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
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

  it('keeps legacy scene headers layout-driven until each scene migrates', () => {
    for (const [filename, source] of PROJECT_SCENES) {
      if (source.includes('<EnterpriseFrame')) continue;
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

  it('adds More Systems rows as concrete nodes instead of mapped JSX fragments', () => {
    expect(moreSystemsSource).not.toContain('{systems.map(');
    expect(moreSystemsSource).toContain('for (let index = 0; index < systems.length; index += 1)');
    expect(moreSystemsSource).toContain('view.add(\n      <Layout');
  });

  it('uses IBM Plex typography', () => {
    expect(THEME.font.sans).toBe('IBM Plex Sans');
    expect(THEME.font.display).toBe('IBM Plex Sans');
    expect(THEME.font.mono).toBe('IBM Plex Mono');
  });

  it('uses one bounded motion vocabulary', () => {
    expect(MOTION.micro).toBeGreaterThanOrEqual(0.08);
    expect(MOTION.micro).toBeLessThanOrEqual(0.18);
    expect(MOTION.component).toBeGreaterThanOrEqual(0.18);
    expect(MOTION.component).toBeLessThanOrEqual(0.45);
    expect(MOTION.scene).toBeGreaterThanOrEqual(0.35);
    expect(MOTION.scene).toBeLessThanOrEqual(0.7);
  });

  it('keeps Motion Canvas icon colors safe', () => {
    expect(techIconSource).toContain('<SVG');
    expect(techIconSource).not.toContain("fill={'transparent'}");
    expect(techIconSource).toContain("fill={'#00000000'}");
  });

  it('keeps GeoPlatform domain vocabulary intact during migration', () => {
    expect(geoplatformSource).toContain('MINING');
    expect(geoplatformSource).toContain('SATELLITE');
    expect(geoplatformSource).toContain('WEATHER');
    expect(geoplatformSource).toContain('SEISMIC');
    expect(geoplatformSource).toContain('ROUTES');
  });

  it('keeps the cover IBM Plex based and wrap-safe', () => {
    expect(coverSource).toContain('RegistrationMarks');
    expect(coverSource).not.toContain('Georgia');
    expect(coverSource).not.toContain('textWrap');
  });
});
