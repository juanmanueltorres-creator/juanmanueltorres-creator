import {describe, expect, it} from 'vitest';
import pulsoSource from '../scenes/03-pulso.tsx?raw';
import enterpriseFrameSource from '../shared/components/EnterpriseFrame.tsx?raw';
import {FLEETFLOW_ROUTE} from '../scenes/05-fleetflow';

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
    const xs = FLEETFLOW_ROUTE.map(([x]) => Math.abs(x));
    const ys = FLEETFLOW_ROUTE.map(([, y]) => Math.abs(y));
    expect(Math.max(...xs)).toBeLessThanOrEqual(350);
    expect(Math.max(...ys)).toBeLessThanOrEqual(72);
  });
});
