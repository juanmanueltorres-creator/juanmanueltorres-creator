import {describe, expect, it} from 'vitest';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import enterpriseFrameSource from '../shared/components/EnterpriseFrame.tsx?raw';

describe('enterprise micro polish', () => {
  it('keeps the Pulso signal rail compact', () => {
    expect(pulsoSource).toContain('height={156}');
    expect(pulsoSource).toContain('height={86}');
  });

  it('keeps shared enterprise footers readable at feed scale', () => {
    expect(enterpriseFrameSource).toContain('fill={THEME.color.muted}');
    expect(enterpriseFrameSource).toContain('fontWeight={500}');
  });

  it('keeps the FleetFlow route comfortably inside its viewport', () => {
    expect(fleetflowSource).toContain('[-340, 36]');
    expect(fleetflowSource).toContain('[340, -66]');
    expect(fleetflowSource).not.toContain('[-390, 58]');
    expect(fleetflowSource).not.toContain('[390, -92]');
  });
});
