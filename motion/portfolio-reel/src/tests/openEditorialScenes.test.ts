import {describe, expect, it} from 'vitest';
import coverSource from '../scenes/01-cover.tsx?raw';
import geoSource from '../scenes/02-geoplatform.tsx?raw';

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
});
