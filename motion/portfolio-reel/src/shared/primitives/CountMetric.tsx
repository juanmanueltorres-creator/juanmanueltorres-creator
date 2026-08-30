import {
  tween,
  type SimpleSignal,
  type ThreadGenerator,
} from '@motion-canvas/core';

export interface MetricFormatOptions {
  decimals?: number;
  prefix?: string;
  suffix?: string;
}

function normalizeDecimals(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 0;
  return Math.min(6, Math.max(0, Math.floor(value)));
}

export function formatMetric(
  value: number,
  options: MetricFormatOptions = {},
): string {
  const safeValue = Number.isFinite(value) ? value : 0;
  const decimals = normalizeDecimals(options.decimals);
  const prefix = options.prefix ?? '';
  const suffix = options.suffix ?? '';
  return `${prefix}${safeValue.toFixed(decimals)}${suffix}`;
}

export function* countMetric(
  signal: SimpleSignal<string>,
  from: number,
  to: number,
  duration: number,
  options: MetricFormatOptions = {},
): ThreadGenerator {
  const safeFrom = Number.isFinite(from) ? from : 0;
  const safeTo = Number.isFinite(to) ? to : 0;
  const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;

  signal(formatMetric(safeFrom, options));
  if (safeDuration === 0) {
    signal(formatMetric(safeTo, options));
    return;
  }

  yield* tween(safeDuration, progress => {
    const value = safeFrom + (safeTo - safeFrom) * progress;
    signal(formatMetric(value, options));
  });
  signal(formatMetric(safeTo, options));
}
