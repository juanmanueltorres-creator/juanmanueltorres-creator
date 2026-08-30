export const CONTENT_LEFT = -468;
export const CONTENT_RIGHT = 468;

export function leftAlignedCenterX(width: number): number {
  return CONTENT_LEFT + width / 2;
}

export function rightAlignedCenterX(width: number): number {
  return CONTENT_RIGHT - width / 2;
}
