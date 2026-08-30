import type {Line} from '@motion-canvas/2d';
import {easeInOutCubic, type ThreadGenerator} from '@motion-canvas/core';

export function clampProgress(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function* drawPath(path: Line, duration = 0.55): ThreadGenerator {
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
  path.end(clampProgress(0));
  yield* path.end(1, safeDuration, easeInOutCubic);
}
