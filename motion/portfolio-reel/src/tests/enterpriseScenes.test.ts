import {describe, expect, it} from 'vitest';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import antiIaSource from '../scenes/04-anti-ia.tsx?raw';

describe('scene migration contracts', () => {
  it('preserves provenance states in Pulso after open editorial migration', () => {
    expect(pulsoSource).not.toContain('<EnterpriseFrame');
    expect(pulsoSource).toContain('SIGNAL');
    expect(pulsoSource).toContain('SOURCE');
    expect(pulsoSource).toContain('FRESHNESS');
    expect(pulsoSource).toContain('PROVENANCE ON');
  });

  it('keeps Anti IA open while preserving the evidence hierarchy', () => {
    expect(antiIaSource).toContain('EditorialHeader');
    expect(antiIaSource).toContain('ScreenshotSurface');
    expect(antiIaSource).not.toContain('<EnterpriseFrame');
    expect(antiIaSource).not.toContain('SurfacePanel');
    expect(antiIaSource).not.toContain('StatusChip');
    expect(antiIaSource).toContain('COORDINATE');
    expect(antiIaSource).toContain('EVIDENCE');
    expect(antiIaSource).toContain('QUESTION');
    expect(antiIaSource).toContain('Una coordenada no es un punto.');
    expect(antiIaSource).not.toContain('textWrap');
  });
});
