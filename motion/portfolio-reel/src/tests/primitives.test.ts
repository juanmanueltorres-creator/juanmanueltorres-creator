import {describe, expect, it} from 'vitest';
import {normalizeFocalPosition} from '../shared/primitives/ScreenshotReveal';
import {normalizePulseRadius} from '../shared/primitives/ScanPulse';

describe('ScreenshotReveal', () => {
  it('maps focal positions deterministically', () => {
    expect(normalizeFocalPosition('center')).toEqual({x: 0, y: 0});
    expect(normalizeFocalPosition('top')).toEqual({x: 0, y: -1});
    expect(normalizeFocalPosition('bottom')).toEqual({x: 0, y: 1});
  });
});

describe('ScanPulse', () => {
  it('clamps invalid radii to a safe finite range', () => {
    expect(normalizePulseRadius(-20)).toBe(0);
    expect(normalizePulseRadius(180)).toBe(180);
    expect(normalizePulseRadius(5000)).toBe(720);
    expect(normalizePulseRadius(Number.NaN)).toBe(0);
  });
});
