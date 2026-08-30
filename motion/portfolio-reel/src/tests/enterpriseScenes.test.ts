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

  it('uses enterprise frame and evidence hierarchy in Anti IA', () => {
    expect(antiIaSource).toContain('<EnterpriseFrame');
    expect(antiIaSource).toContain('COORDINATE');
    expect(antiIaSource).toContain('EVIDENCE');
    expect(antiIaSource).toContain('QUESTION');
    expect(antiIaSource).not.toContain('textWrap');
  });
});
