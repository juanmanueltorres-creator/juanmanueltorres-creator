import {describe, expect, it} from 'vitest';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import {routeTrailWindow} from '../shared/primitives/RouteTrail';

describe('FleetFlow enterprise route treatment', () => {
  it('keeps route trail progress finite and bounded', () => {
    expect(routeTrailWindow(-1, 0.24)).toEqual({start: 0, end: 0});
    expect(routeTrailWindow(0.5, 0.24)).toEqual({start: 0.26, end: 0.5});
    expect(routeTrailWindow(2, 0.24)).toEqual({start: 0.76, end: 1});
  });

  it('upgrades FleetFlow into the enterprise operational frame', () => {
    expect(fleetflowSource).toContain('<EnterpriseFrame');
    expect(fleetflowSource).toContain('MetricPanel');
    expect(fleetflowSource).toContain('RouteTrail');
  });
});
