import {describe, expect, it} from 'vitest';
import {normalizeFocalPosition} from '../shared/primitives/ScreenshotReveal';
import {normalizePulseRadius} from '../shared/primitives/ScanPulse';
import {clampProgress} from '../shared/primitives/DrawPath';
import {boundedPoints} from '../shared/primitives/StaggerPoints';
import {formatMetric} from '../shared/primitives/CountMetric';

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

describe('DrawPath', () => {
  it('clamps path progress to 0-1', () => {
    expect(clampProgress(-1)).toBe(0);
    expect(clampProgress(0.5)).toBe(0.5);
    expect(clampProgress(2)).toBe(1);
    expect(clampProgress(Number.NaN)).toBe(0);
  });
});

describe('StaggerPoints', () => {
  it('bounds staggered point collections', () => {
    expect(boundedPoints([1, 2, 3, 4], 3)).toEqual([1, 2, 3]);
  });
});

describe('CountMetric', () => {
  it('formats metrics without NaN or Infinity', () => {
    expect(formatMetric(12.36, {decimals: 1, suffix: ' km'})).toBe('12.4 km');
    expect(formatMetric(Number.NaN)).toBe('0');
    expect(formatMetric(Number.POSITIVE_INFINITY)).toBe('0');
  });
});
