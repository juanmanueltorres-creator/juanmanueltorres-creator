import type {Txt} from '@motion-canvas/2d';
import {all, easeOutCubic, type ThreadGenerator} from '@motion-canvas/core';

export function* revealText(
  node: Txt,
  duration = 0.35,
  offsetY = 18,
): ThreadGenerator {
  const originalY = node.y();
  node.opacity(0);
  node.y(originalY + offsetY);

  yield* all(
    node.opacity(1, duration, easeOutCubic),
    node.y(originalY, duration, easeOutCubic),
  );
}
