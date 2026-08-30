import {Layout, Rect, Txt, type ComponentChildren} from '@motion-canvas/2d';
import {THEME} from '../theme';
import {ProjectHeader} from './ProjectHeader';
import {RegistrationMarks} from './RegistrationMarks';

export interface EnterpriseFrameProps {
  eyebrow: string;
  name: string;
  status: string;
  children: ComponentChildren;
  footer?: string;
}

export function EnterpriseFrame({
  eyebrow,
  name,
  status,
  children,
  footer,
}: EnterpriseFrameProps) {
  return (
    <Rect
      width={1024}
      height={1294}
      radius={24}
      fill={THEME.color.workspace}
      stroke={THEME.color.borderSoft}
      lineWidth={1}
    >
      <RegistrationMarks />
      <Layout
        layout
        width={936}
        height={1180}
        direction={'column'}
        gap={24}
        alignItems={'center'}
      >
        <ProjectHeader eyebrow={eyebrow} name={name} status={status} />
        {children}
        {footer ? (
          <Txt
            text={footer}
            fill={THEME.color.muted}
            fontFamily={THEME.font.mono}
            fontSize={THEME.type.micro}
            fontWeight={500}
            letterSpacing={0.35}
          />
        ) : null}
      </Layout>
    </Rect>
  );
}
