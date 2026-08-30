import {describe, expect, it} from 'vitest';
import atlasSource from '../scenes/06-atlas.tsx?raw';
import moreSystemsSource from '../scenes/07-more-systems.tsx?raw';

describe('enterprise closing scenes', () => {
  it('uses enterprise filter state in Atlas', () => {
    expect(atlasSource).toContain('<EnterpriseFrame');
    expect(atlasSource).toContain('StatusChip');
    expect(atlasSource).toContain('PROVINCE');
    expect(atlasSource).toContain('MINERAL');
    expect(atlasSource).toContain('STAGE');
    expect(atlasSource).toContain('COMPANY');
    expect(atlasSource).toContain('CAPITAL');
  });

  it('keeps More Systems as a stable populated enterprise close', () => {
    expect(moreSystemsSource).toContain('RegistrationMarks');
    expect(moreSystemsSource).toContain('THEME.color.workspace');
    expect(moreSystemsSource).not.toContain('textWrap');
    expect(moreSystemsSource).not.toContain('{systems.map(');
    expect(moreSystemsSource).not.toContain('opacity={0}');
    expect(moreSystemsSource).not.toContain('revealText(');
    expect(moreSystemsSource).toContain('Question Radar');
    expect(moreSystemsSource).toContain('Opportunity OS');
    expect(moreSystemsSource).toContain('Screen2Social');
    expect(moreSystemsSource).toContain('Geo Agent');
  });
});
