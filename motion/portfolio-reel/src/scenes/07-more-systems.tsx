import {Circle, Layout, Line, makeScene2D, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {carouselMetadata} from '../shared/metadata';
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

  view.fill(THEME.color.canvas);

  view.add(
    <Layout
      layout
      width={THEME.space.contentWidth}
      height={230}
      y={-490}
      direction={'column'}
      alignItems={'start'}
      justifyContent={'center'}
      gap={12}
    >
      <Txt
        text={'07 / MORE SYSTEMS'}
        fill={THEME.color.accentSoft}
        fontFamily={THEME.font.mono}
        fontSize={14}
        fontWeight={500}
        letterSpacing={0.55}
      />
      <Txt
        text={'Small tools, local systems\nand experiments.'}
        fill={THEME.color.text}
        fontFamily={THEME.font.sans}
        fontSize={46}
        fontWeight={600}
        lineHeight={55}
      />
      <Txt
        text={'A second layer of builds focused on workflows, question structuring,\nmedia production and agent experiments.'}
        fill={THEME.color.muted}
        fontFamily={THEME.font.sans}
        fontSize={18}
        fontWeight={400}
        lineHeight={26}
      />
    </Layout>,
  );

  view.add(
    <Line
      ref={spine}
      points={[[-372, -235], [-372, 365]]}
      stroke={THEME.color.borderSoft}
      lineWidth={1.5}
    />,
  );

  for (let index = 0; index < systems.length; index += 1) {
    const {category, item} = systems[index];
    const y = -170 + index * 155;

    view.add(
      <Line
        ref={branches[index]}
        points={[[-372, y], [-275, y]]}
        stroke={index === systems.length - 1 ? THEME.color.accentSoft : THEME.color.border}
        lineWidth={1.5}
      />,
    );

    view.add(
      <Circle
        ref={endpointRefs[index]}
        x={-265}
        y={y}
        width={10}
        height={10}
        fill={THEME.color.canvas}
        stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.muted}
        lineWidth={1.5}
      />,
    );

    view.add(
      <Layout
        layout
        x={102}
        y={y + 8}
        width={650}
        height={104}
        direction={'column'}
        alignItems={'start'}
        justifyContent={'center'}
        gap={2}
      >
        <Txt
          text={category}
          width={650}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={12}
          fontWeight={500}
          letterSpacing={0.45}
        />
        <Txt
          text={item.name}
          width={650}
          fill={THEME.color.text}
          fontFamily={THEME.font.sans}
          fontSize={32}
          fontWeight={600}
        />
        <Txt
          text={item.stack.slice(0, 3).join(' · ')}
          width={650}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.2}
        />
      </Layout>,
    );
  }

  view.add(
    <Layout
      layout
      width={THEME.space.contentWidth}
      height={36}
      y={570}
      alignItems={'center'}
      justifyContent={'space-between'}
    >
      <Txt
        text={'github.com/juanmanueltorres-creator'}
        fill={THEME.color.muted2}
        fontFamily={THEME.font.mono}
        fontSize={13}
        fontWeight={400}
        letterSpacing={0.3}
      />
      <Txt
        text={'SYSTEMS / 04'}
        fill={THEME.color.accentSoft}
        fontFamily={THEME.font.mono}
        fontSize={13}
        fontWeight={500}
        letterSpacing={0.3}
      />
    </Layout>,
  );

  spine().end(0);
  for (const branch of branches) branch().end(0);
  for (const endpoint of endpointRefs) endpoint().opacity(0);

  yield* drawPath(spine(), 0.34);

  for (let index = 0; index < systems.length; index += 1) {
    yield* all(
      drawPath(branches[index](), 0.16),
      endpointRefs[index]().opacity(1, 0.12),
    );
  }

  yield* waitFor(0.9);
});
