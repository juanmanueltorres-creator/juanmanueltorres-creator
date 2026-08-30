import {Layout, Txt} from '@motion-canvas/2d';
import type {SignalValue} from '@motion-canvas/core';
import type {IconName} from '../icons';
import {THEME} from '../theme';
import {SurfacePanel} from './SurfacePanel';
import {TechIcon} from './TechIcon';

export interface MetricPanelProps {
  label: string;
  value: SignalValue<string>;
  icon?: IconName;
  width?: number;
}

export function MetricPanel({label, value, icon, width = 210}: MetricPanelProps) {
  return (
    <SurfacePanel
      layout
      width={width}
      height={78}
      padding={[14, 16]}
      direction={'column'}
      gap={6}
      alignItems={'start'}
    >
      <Layout layout gap={7} alignItems={'center'}>
        {icon ? <TechIcon name={icon} size={15} /> : null}
        <Txt
          text={label}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={THEME.type.micro}
          fontWeight={600}
        />
      </Layout>
      <Txt
        text={value}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={THEME.type.metric}
        fontWeight={600}
      />
    </SurfacePanel>
  );
}
