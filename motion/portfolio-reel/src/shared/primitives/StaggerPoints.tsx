import type {Circle} from '@motion-canvas/2d';
import {
  all,
  delay,
  easeOutCubic,
  type ThreadGenerator,
} from '@motion-canvas/core';

export function boundedPoints<T>(
  items: readonly T[],
  max = 24,
): readonly T[] {
  const safeMax = Number.isFinite(max) ? Math.max(0, Math.floor(max)) : 0;
  return items.slice(0, safeMax);
}

function* revealPoint(node: Circle, duration = 0.22): ThreadGenerator {
  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.scale(1, duration, easeOutCubic),
  );
}

export function* staggerPoints(
  nodes: readonly Circle[],
  interval = 0.06,
  max = 24,
): ThreadGenerator {
  const safeInterval = Number.isFinite(interval) && interval > 0 ? interval : 0;
  const limited = boundedPoints(nodes, max);

  for (const node of limited) {
    node.opacity(0);
    node.scale(0);
  }

  yield* all(
    ...limited.map((node, index) =>
      delay(index * safeInterval, revealPoint(node)),
    ),
  );
}
