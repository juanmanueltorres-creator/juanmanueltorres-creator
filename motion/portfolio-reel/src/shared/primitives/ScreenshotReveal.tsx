import type {Rect} from '@motion-canvas/2d';
import {all, easeOutCubic, type ThreadGenerator} from '@motion-canvas/core';
import type {ImagePosition} from '../types';

export function normalizeFocalPosition(
  value: ImagePosition,
): {x: number; y: number} {
  switch (value) {
    case 'top':
      return {x: 0, y: -1};
    case 'bottom':
      return {x: 0, y: 1};
    case 'left':
      return {x: -1, y: 0};
    case 'right':
      return {x: 1, y: 0};
    case 'center':
    default:
      return {x: 0, y: 0};
  }
}

function clampStartScale(value: number): number {
  if (!Number.isFinite(value)) return 1;
  return Math.min(1.06, Math.max(1, value));
}

export function* revealScreenshot(
  node: Rect,
  duration = 0.45,
  startScale = 1.03,
): ThreadGenerator {
  const safeScale = clampStartScale(startScale);
  node.opacity(0);
  node.scale(safeScale);

  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.scale(1, duration, easeOutCubic),
  );
}
