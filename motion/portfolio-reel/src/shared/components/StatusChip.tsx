import {Rect, Txt} from '@motion-canvas/2d';
import type {IconName} from '../icons';
import {THEME} from '../theme';
import {TechIcon} from './TechIcon';

export interface StatusChipProps {
  label: string;
  active?: boolean;
  icon?: IconName;
  width?: number;
}

export function StatusChip({label, active = false, icon, width}: StatusChipProps) {
  return (
    <Rect
      layout
      width={width}
      height={34}
      radius={17}
      padding={[0, 14]}
      gap={8}
      alignItems={'center'}
      fill={active ? THEME.color.raised : THEME.color.workspace}
      stroke={active ? THEME.color.accentSoft : THEME.color.borderSoft}
      lineWidth={1}
    >
      {icon ? <TechIcon name={icon} size={15} /> : null}
      <Txt
        text={label}
        fill={active ? THEME.color.text : THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={THEME.type.micro}
        fontWeight={600}
      />
    </Rect>
  );
}
