import {describe, expect, it} from 'vitest';
import projectSource from '../project.ts?raw';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoplatformSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';
import techIconSource from '../shared/components/TechIcon.tsx?raw';
import {MOTION} from '../shared/motion';
import {clampScreenshotScale} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

const PRODUCT_SCENES = [
  ['02-geoplatform.tsx', geoplatformSource],
  ['03-pulso.tsx', pulsoSource],
  ['04-anti-ia.tsx', antiIaSource],
  ['05-fleetflow.tsx', fleetflowSource],
  ['06-atlas.tsx', atlasSource],
] as const;

const ALL_SCENES = [
  ['01-cover.tsx', coverSource],
  ...PRODUCT_SCENES,
  ['07-more-systems.tsx', moreSystemsSource],
] as const;

describe('motion reel visual contract', () => {
  it('uses the portrait social canvas contract', () => {
    expect(THEME.canvas).toEqual({width: 1080, height: 1350, fps: 25});
  });

  it('locks the screenshot geometry and bounded reveal scale', () => {
    expect(THEME.space.screenshotWidth).toBe(936);
    expect(THEME.space.screenshotHeight).toBe(560);
    expect(THEME.space.screenshotRadius).toBe(18);
    expect(THEME.space.screenshotWidth).toBe(THEME.space.contentWidth);
    expect(clampScreenshotScale(2)).toBe(1.03);
    expect(clampScreenshotScale(0.5)).toBe(1);
  });

  it('keeps the open editorial spacing contract', () => {
    expect(THEME.space.edgeMin).toBeGreaterThanOrEqual(64);
    expect(THEME.space.localVisualMin).toBeGreaterThanOrEqual(56);
  });

  it('keeps every product scene on the final open editorial shell', () => {
    for (const [filename, source] of PRODUCT_SCENES) {
      expect(source, filename).toContain('EditorialHeader');
      expect(source, filename).toContain('ScreenshotSurface');
      expect(source, filename).not.toContain('EnterpriseFrame');
      expect(source, filename).not.toContain('SurfacePanel');
      expect(source, filename).not.toContain('textWrap');
      expect(source, filename).not.toContain('width={1024}');
    }
  });

  it('registers exactly the seven intended scene modules', () => {
    for (const scenePath of [
      './scenes/01-cover?scene',
      './scenes/02-geoplatform?scene',
      './scenes/03-pulso?scene',
      './scenes/04-anti-ia?scene',
      './scenes/05-fleetflow?scene',
      './scenes/06-atlas?scene',
      './scenes/07-more-systems?scene',
    ]) {
      expect(projectSource).toContain(scenePath);
    }
    expect(projectSource.match(/\?scene'/g)?.length).toBe(7);
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

  it('keeps GeoPlatform domain vocabulary intact', () => {
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
    expect(coverSource).not.toContain('width={1024}');
  });
});
