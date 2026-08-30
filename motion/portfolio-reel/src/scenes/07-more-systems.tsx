import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {RegistrationMarks} from '../shared/components/RegistrationMarks';
import {SurfacePanel} from '../shared/components/SurfacePanel';
import {carouselMetadata} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {THEME} from '../shared/theme';

const SYSTEM_ORDER = [
  ['QUESTION', 'Question Radar'],
  ['WORKFLOW', 'Opportunity OS'],
  ['MEDIA', 'Screen2Social'],
  ['AGENTS', 'Geo Agent'],
] as const;

export default makeScene2D(function* (view) {
  const spine = createRef<Line>();
  const branches = SYSTEM_ORDER.map(() => createRef<Line>());
  const endpointRefs = SYSTEM_ORDER.map(() => createRef<Circle>());

  const systems = SYSTEM_ORDER.map(([category, name]) => {
    const item = carouselMetadata.moreSystems.items.find(candidate => candidate.name === name);
    if (!item) {
      throw new Error(`more system '${name}' not found in canonical metadata`);
    }
    return {category, item};
  });

  const closingTitle = carouselMetadata.moreSystems.title.replace(
    ' and experiments.',
    '\nand experiments.',
  );

  view.fill(THEME.color.canvas);
  view.add(
    <Rect
      width={1024}
      height={1294}
      radius={24}
      fill={THEME.color.workspace}
      stroke={THEME.color.borderSoft}
      lineWidth={1}
    >
      <RegistrationMarks />
    </Rect>,
  );

  view.add(
    <Layout
      layout
      width={936}
      height={176}
      y={-506}
      direction={'column'}
      alignItems={'start'}
      justifyContent={'center'}
      gap={14}
    >
      <Txt
        text={carouselMetadata.moreSystems.eyebrow}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={THEME.type.eyebrow}
        fontWeight={600}
        letterSpacing={2}
      />
      <Txt
        text={closingTitle}
        fill={THEME.color.text}
        fontFamily={THEME.font.sans}
        fontSize={44}
        fontWeight={600}
        lineHeight={54}
      />
    </Layout>,
  );

  view.add(
    <SurfacePanel
      width={900}
      height={718}
      y={92}
      level={'raised'}
    />,
  );

  view.add(
    <Line
      ref={spine}
      points={[[-338, -238], [-338, 392]]}
      stroke={THEME.color.border}
      lineWidth={2}
    />,
  );

  for (let index = 0; index < systems.length; index += 1) {
    const {category, item} = systems[index];
    const y = -172 + index * 162;
    const active = index === systems.length - 1;

    view.add(
      <Line
        ref={branches[index]}
        points={[[-338, y], [-238, y]]}
        stroke={active ? THEME.color.accentSoft : THEME.color.border}
        lineWidth={2}
      />,
    );

    view.add(
      <Circle
        ref={endpointRefs[index]}
        x={-226}
        y={y}
        width={12}
        height={12}
        fill={THEME.color.workspace}
        stroke={active ? THEME.color.accent : THEME.color.text}
        lineWidth={2}
      />,
    );

    view.add(
      <Layout
        layout
        x={112}
        y={y + 3}
        width={590}
        height={112}
        direction={'column'}
        alignItems={'start'}
        justifyContent={'center'}
        gap={3}
      >
        <Txt
          text={category}
          width={590}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={600}
          letterSpacing={1.35}
        />
        <Txt
          text={item.name}
          width={590}
          fill={THEME.color.text}
          fontFamily={THEME.font.sans}
          fontSize={33}
          fontWeight={600}
        />
        <Txt
          text={item.stack.slice(0, 3).join(' · ')}
          width={590}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={500}
        />
      </Layout>,
    );
  }

  view.add(
    <Layout
      layout
      width={936}
      height={40}
      y={570}
      direction={'column'}
      alignItems={'start'}
      justifyContent={'center'}
    >
      <Txt
        text={'github.com/juanmanueltorres-creator'}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={14}
        fontWeight={500}
        letterSpacing={0.8}
      />
    </Layout>,
  );

  spine().end(0);
  for (const branch of branches) branch().end(0);
  for (const endpoint of endpointRefs) endpoint().opacity(0);

  yield* drawPath(spine(), MOTION.component);

  for (let index = 0; index < systems.length; index += 1) {
    yield* all(
      drawPath(branches[index](), MOTION.micro),
      endpointRefs[index]().opacity(1, MOTION.micro, MOTION.easing.enter),
    );
  }

  yield* waitFor(0.92);
});
