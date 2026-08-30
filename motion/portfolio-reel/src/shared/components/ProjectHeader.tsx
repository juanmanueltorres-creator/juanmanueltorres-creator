import {Layout, Txt} from '@motion-canvas/2d';
import {THEME} from '../theme';
import {StatusChip} from './StatusChip';

export interface ProjectHeaderProps {
  eyebrow: string;
  name: string;
  status: string;
}

export function ProjectHeader({eyebrow, name, status}: ProjectHeaderProps) {
  return (
    <Layout
      layout
      width={936}
      height={58}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Layout layout direction={'column'} gap={3} alignItems={'start'}>
        <Txt
          text={eyebrow}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={THEME.type.micro}
          fontWeight={600}
          letterSpacing={1.4}
        />
        <Txt
          text={name}
          fill={THEME.color.text}
          fontFamily={THEME.font.sans}
          fontSize={42}
          fontWeight={600}
        />
      </Layout>
      <StatusChip label={status} active />
    </Layout>
  );
}
