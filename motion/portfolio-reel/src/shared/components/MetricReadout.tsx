import {Layout, Txt} from '@motion-canvas/2d';
import type {SignalValue} from '@motion-canvas/core';
import type {IconName} from '../icons';
import {THEME} from '../theme';
import {TechIcon} from './TechIcon';
import {TechnicalLabel} from './TechnicalLabel';

export interface MetricReadoutProps {
  label: string;
  value: SignalValue<string>;
  icon?: IconName;
  width?: number;
}

export function MetricReadout({
  label,
  value,
  icon,
  width = 280,
}: MetricReadoutProps) {
  return (
    <Layout
      layout
      width={width}
      direction={'column'}
      gap={5}
      alignItems={'start'}
    >
      <Layout layout gap={8} alignItems={'center'}>
        {icon ? <TechIcon name={icon} size={14} /> : null}
        <TechnicalLabel text={label} />
      </Layout>
      <Txt
        text={value}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={28}
        fontWeight={500}
      />
    </Layout>
  );
}
