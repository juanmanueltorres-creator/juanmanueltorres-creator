import {Img, Rect} from '@motion-canvas/2d';
import type {Reference} from '@motion-canvas/core';
import {ASSET_URLS} from '../assets';
import {normalizeFocalPosition} from '../primitives/ScreenshotReveal';
import {THEME} from '../theme';
import type {ImagePosition} from '../types';

export interface ScreenshotSurfaceProps {
  screenshot: string;
  imagePosition: ImagePosition;
  width?: number;
  height?: number;
  imageWidthPadding?: number;
  frameRef?: Reference<Rect>;
}

export function ScreenshotSurface({
  screenshot,
  imagePosition,
  width = THEME.space.screenshotWidth,
  height = THEME.space.screenshotHeight,
  imageWidthPadding = 120,
  frameRef,
}: ScreenshotSurfaceProps) {
  const focal = normalizeFocalPosition(imagePosition);

  return (
    <Rect
      ref={frameRef}
      width={width}
      height={height}
      radius={THEME.space.screenshotRadius}
      clip
      fill={THEME.color.raised}
      stroke={THEME.color.border}
      lineWidth={1}
      shadowColor={THEME.shadow.product.color}
      shadowBlur={THEME.shadow.product.blur}
      shadowOffset={THEME.shadow.product.offset}
      opacity={0}
    >
      <Img
        src={ASSET_URLS[screenshot]}
        width={width + imageWidthPadding}
        x={focal.x * 44}
        y={focal.y * 34}
      />
    </Rect>
  );
}
