import {Rect, type RectProps} from '@motion-canvas/2d';
import {THEME} from '../theme';

export type SurfaceLevel = 'workspace' | 'raised';

export interface SurfacePanelProps extends RectProps {
  level?: SurfaceLevel;
}

export function SurfacePanel({level = 'raised', ...props}: SurfacePanelProps) {
  return (
    <Rect
      radius={18}
      fill={level === 'raised' ? THEME.color.raised : THEME.color.workspace}
      stroke={THEME.color.borderSoft}
      lineWidth={1}
      {...props}
    />
  );
}
