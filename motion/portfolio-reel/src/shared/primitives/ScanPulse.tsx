import type {Circle} from '@motion-canvas/2d';
import {all, easeOutCubic, type ThreadGenerator} from '@motion-canvas/core';

export function normalizePulseRadius(radius: number): number {
  if (!Number.isFinite(radius)) return 0;
  return Math.min(720, Math.max(0, radius));
}

export function* scanPulse(
  node: Circle,
  duration = 0.65,
  radius = 180,
): ThreadGenerator {
  const safeRadius = normalizePulseRadius(radius);
  node.size(8);
  node.opacity(0.35);

  yield* all(
    node.size(safeRadius * 2, duration, easeOutCubic),
    node.opacity(0, duration, easeOutCubic),
  );
}
