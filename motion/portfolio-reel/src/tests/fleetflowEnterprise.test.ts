import {describe, expect, it} from 'vitest';
import {routeTrailWindow} from '../shared/primitives/RouteTrail';

describe('FleetFlow route trail treatment', () => {
  it('keeps route trail progress finite and bounded', () => {
    expect(routeTrailWindow(-1, 0.24)).toEqual({start: 0, end: 0});
    expect(routeTrailWindow(0.5, 0.24)).toEqual({start: 0.26, end: 0.5});
    expect(routeTrailWindow(2, 0.24)).toEqual({start: 0.76, end: 1});
  });
});
