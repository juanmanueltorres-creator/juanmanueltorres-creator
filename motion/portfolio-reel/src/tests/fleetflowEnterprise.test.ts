import {describe, expect, it} from 'vitest';
import fleetflowSource from '../scenes/05-fleetflow.tsx?raw';
import {routeTrailWindow} from '../shared/primitives/RouteTrail';

describe('FleetFlow route trail treatment', () => {
  it('keeps route trail progress finite and bounded', () => {
    expect(routeTrailWindow(-1, 0.24)).toEqual({start: 0, end: 0});
    expect(routeTrailWindow(0.5, 0.24)).toEqual({start: 0.26, end: 0.5});
    expect(routeTrailWindow(2, 0.24)).toEqual({start: 0.76, end: 1});
  });

  it('keeps FleetFlow open, operational and screenshot-led', () => {
    expect(fleetflowSource).toContain('EditorialHeader');
    expect(fleetflowSource).toContain('ScreenshotSurface');
    expect(fleetflowSource).toContain('applyRouteTrail');
    expect(fleetflowSource).toContain('DELIVERED');
    expect(fleetflowSource).toContain('DISTANCE');
    expect(fleetflowSource).toContain('ACTIVE');
    expect(fleetflowSource).not.toContain('width={1024}');
    expect(fleetflowSource).not.toContain('height={1294}');
    expect(fleetflowSource).not.toContain('fill={THEME.color.surfaceRaised}');
  });
});
