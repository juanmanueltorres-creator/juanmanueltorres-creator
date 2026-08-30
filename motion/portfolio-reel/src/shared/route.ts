export type Point2D = readonly [number, number];

function clampUnit(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

export function interpolatePolyline(
  points: readonly Point2D[],
  progress: number,
): {x: number; y: number} {
  if (points.length === 0) return {x: 0, y: 0};
  if (points.length === 1) return {x: points[0][0], y: points[0][1]};

  const segmentLengths: number[] = [];
  let totalLength = 0;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[index + 1];
    const length = Math.hypot(x2 - x1, y2 - y1);
    segmentLengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) {
    return {x: points[0][0], y: points[0][1]};
  }

  const target = clampUnit(progress) * totalLength;
  let traversed = 0;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const length = segmentLengths[index];
    const next = traversed + length;
    if (target <= next || index === segmentLengths.length - 1) {
      if (length === 0) {
        traversed = next;
        continue;
      }
      const local = (target - traversed) / length;
      const [x1, y1] = points[index];
      const [x2, y2] = points[index + 1];
      return {
        x: x1 + (x2 - x1) * local,
        y: y1 + (y2 - y1) * local,
      };
    }
    traversed = next;
  }

  const [x, y] = points[points.length - 1];
  return {x, y};
}
