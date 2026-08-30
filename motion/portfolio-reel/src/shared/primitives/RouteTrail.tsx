import type {Line} from '@motion-canvas/2d';

export function routeTrailWindow(progress: number, length = 0.24) {
  const safeProgress = Number.isFinite(progress)
    ? Math.max(0, Math.min(1, progress))
    : 0;
  const safeLength = Number.isFinite(length)
    ? Math.max(0, Math.min(1, length))
    : 0.24;

  return {
    start: Math.max(0, safeProgress - safeLength),
    end: safeProgress,
  };
}

export function applyRouteTrail(node: Line, progress: number, length = 0.24) {
  const {start, end} = routeTrailWindow(progress, length);
  node.start(start);
  node.end(end);
}
