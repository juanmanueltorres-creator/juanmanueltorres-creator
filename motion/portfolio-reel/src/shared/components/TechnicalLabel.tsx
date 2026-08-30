import {Txt} from '@motion-canvas/2d';
import {THEME} from '../theme';

export interface TechnicalLabelProps {
  text: string;
  active?: boolean;
}

export function TechnicalLabel({text, active = false}: TechnicalLabelProps) {
  return (
    <Txt
      text={text}
      fill={active ? THEME.color.accent : THEME.color.muted}
      fontFamily={THEME.font.mono}
      fontSize={14}
      fontWeight={500}
      letterSpacing={0.55}
    />
  );
}
