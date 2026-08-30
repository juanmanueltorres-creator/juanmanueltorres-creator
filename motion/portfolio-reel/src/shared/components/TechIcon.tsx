import {SVG, type SVGProps} from '@motion-canvas/2d';
import {ICONS, type IconName} from '../icons';
import {THEME} from '../theme';

export interface TechIconProps extends Omit<SVGProps, 'svg'> {
  name: IconName;
  size?: number;
}

export function TechIcon({name, size = 20, ...props}: TechIconProps) {
  return (
    <SVG
      svg={ICONS[name]}
      width={size}
      height={size}
      stroke={THEME.color.muted}
      fill={'#00000000'}
      {...props}
    />
  );
}
