import {Layout, Txt} from '@motion-canvas/2d';
import {THEME} from '../theme';

export interface EditorialHeaderProps {
  eyebrow: string;
  name: string;
  status?: string;
}

export function EditorialHeader({eyebrow, name, status}: EditorialHeaderProps) {
  return (
    <Layout
      layout
      width={THEME.space.contentWidth}
      direction={'column'}
      gap={10}
      alignItems={'start'}
    >
      <Txt
        text={eyebrow}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={600}
        letterSpacing={1.1}
      />
      <Layout
        layout
        width={THEME.space.contentWidth}
        alignItems={'end'}
        justifyContent={'space-between'}
      >
        <Txt
          text={name}
          fill={THEME.color.text}
          fontFamily={THEME.font.sans}
          fontSize={50}
          fontWeight={600}
        />
        {status ? (
          <Txt
            text={status}
            fill={THEME.color.muted}
            fontFamily={THEME.font.mono}
            fontSize={14}
            fontWeight={500}
          />
        ) : null}
      </Layout>
    </Layout>
  );
}
