import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';

describe('open editorial scenes', () => {
  it('removes the enclosing frame from Cover', () => {
    expect(coverSource).not.toContain('width={1024}');
    expect(coverSource).not.toContain('ref={frame}');
    expect(coverSource).not.toContain('textWrap');
    expect(coverSource).toContain('RegistrationMarks');
  });

  it('keeps GeoPlatform screenshot-led and off the enterprise shell', () => {
    expect(geoSource).toContain('EditorialHeader');
    expect(geoSource).toContain('ScreenshotSurface');
    expect(geoSource).not.toContain('EnterpriseFrame');
    expect(geoSource).not.toContain('SurfacePanel');
  });

  it('keeps Pulso signals open, sparse and secondary to the product', () => {
    expect(pulsoSource).toContain('EditorialHeader');
    expect(pulsoSource).toContain('ScreenshotSurface');
    expect(pulsoSource).not.toContain('EnterpriseFrame');
    expect(pulsoSource).not.toContain('SurfacePanel');
    expect(pulsoSource).not.toContain('staggerPoints');
    expect(pulsoSource).toContain('const SIGNAL_POINTS');
    expect(pulsoSource).toContain('SIGNAL · SOURCE · FRESHNESS');
  });

  it('keeps Anti IA evidence-led and unboxed', () => {
    expect(antiIaSource).toContain('EditorialHeader');
    expect(antiIaSource).toContain('ScreenshotSurface');
    expect(antiIaSource).toContain('DATA');
    expect(antiIaSource).toContain('EVIDENCE');
    expect(antiIaSource).toContain('QUESTION');
    expect(antiIaSource).not.toContain('EnterpriseFrame');
    expect(antiIaSource).not.toContain('SurfacePanel');
  });

  it('keeps FleetFlow operational, centered and screenshot-led', () => {
    expect(fleetflowSource).toContain('EditorialHeader');
    expect(fleetflowSource).toContain('ScreenshotSurface');
    expect(fleetflowSource).toContain('applyRouteTrail');
    expect(fleetflowSource).not.toContain('EnterpriseFrame');
    expect(fleetflowSource).not.toContain('SurfacePanel');
  });

  it('keeps Atlas as one open filter interaction', () => {
    expect(atlasSource).toContain('EditorialHeader');
    expect(atlasSource).toContain('ScreenshotSurface');
    for (const label of ['PROVINCE', 'MINERAL', 'STAGE', 'COMPANY', 'CAPITAL']) {
      expect(atlasSource).toContain(label);
    }
    expect(atlasSource).not.toContain('width={1024}');
    expect(atlasSource).not.toContain('SurfacePanel');
    expect(atlasSource).not.toContain('ABSTRACT TERRITORIAL FRAME');
  });

  it('keeps More Systems open, populated and wrap-safe', () => {
    expect(moreSystemsSource).not.toContain('width={1024}');
    expect(moreSystemsSource).not.toContain('textWrap');
    expect(moreSystemsSource).not.toContain('{systems.map(');
    expect(moreSystemsSource).toContain('for (let index = 0; index < systems.length; index += 1)');
    for (const name of ['Question Radar', 'Opportunity OS', 'Screen2Social', 'Geo Agent']) {
      expect(moreSystemsSource).toContain(name);
    }
  });
});
