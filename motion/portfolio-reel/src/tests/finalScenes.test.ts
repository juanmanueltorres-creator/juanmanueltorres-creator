import {describe, expect, it} from 'vitest';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';

describe('final open editorial scenes', () => {
  it('keeps Atlas open, filter-led and screenshot-first', () => {
    expect(atlasSource).toContain('EditorialHeader');
    expect(atlasSource).toContain('ScreenshotSurface');
    expect(atlasSource).not.toContain('width={1024}');
    expect(atlasSource).not.toContain('height={1294}');
    expect(atlasSource).not.toContain('surfaceRaised');
    expect(atlasSource).toContain('PROVINCE');
    expect(atlasSource).toContain('MINERAL');
    expect(atlasSource).toContain('STAGE');
    expect(atlasSource).toContain('COMPANY');
    expect(atlasSource).toContain('CAPITAL');
  });

  it('keeps More Systems populated, open and wrap-safe', () => {
    expect(moreSystemsSource).not.toContain('width={1024}');
    expect(moreSystemsSource).not.toContain('height={1294}');
    expect(moreSystemsSource).not.toContain('textWrap');
    expect(moreSystemsSource).toContain('for (let index = 0; index < systems.length; index += 1)');
    expect(moreSystemsSource).toContain('Question Radar');
    expect(moreSystemsSource).toContain('Opportunity OS');
    expect(moreSystemsSource).toContain('Screen2Social');
    expect(moreSystemsSource).toContain('Geo Agent');
  });
});
