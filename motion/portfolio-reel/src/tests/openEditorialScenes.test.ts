import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoSource from '../scenes/02-geoplatform.tsx?raw';
import pulsoSource from '../scenes/03-pulso.tsx?raw';

describe('open editorial anchor scenes', () => {
  it('removes the enclosing frame from Cover', () => {
    expect(coverSource).not.toContain('width={1024}');
    expect(coverSource).not.toContain('ref={frame}');
    expect(coverSource).not.toContain('textWrap');
    expect(coverSource).toContain('RegistrationMarks');
  });

  it('moves GeoPlatform off the enterprise shell', () => {
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
});
