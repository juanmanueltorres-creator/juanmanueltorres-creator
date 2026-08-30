import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
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

  view.fill(THEME.color.background);
  view.add(
    <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />,
  );

  view.add(
    <Layout
      layout
      width={936}
      height={190}
      y={-500}
      direction={'column'}
      alignItems={'start'}
      justifyContent={'center'}
      gap={18}
    >
      <Txt
        text={carouselMetadata.moreSystems.eyebrow}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={18}
        fontWeight={700}
        letterSpacing={2.4}
      />
      <Txt
        text={carouselMetadata.moreSystems.title}
        width={900}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        lineHeight={60}
        textWrap
      />
    </Layout>,
  );

  view.add(
    <Line
      ref={spine}
      points={[[-330, -285], [-330, 410]]}
      stroke={THEME.color.border}
      lineWidth={3}
    />,
  );

  for (let index = 0; index < systems.length; index += 1) {
    const {category, item} = systems[index];
    const y = -210 + index * 175;

    view.add(
      <Line
        ref={branches[index]}
        points={[[-330, y], [-215, y]]}
        stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.border}
        lineWidth={3}
      />,
    );

    view.add(
      <Circle
        ref={endpointRefs[index]}
        x={-205}
        y={y}
        width={13}
        height={13}
        fill={THEME.color.background}
        stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.text}
        lineWidth={2}
      />,
    );

    view.add(
      <Layout
        layout
        x={105}
        y={y + 12}
        width={560}
        height={118}
        direction={'column'}
        alignItems={'start'}
        justifyContent={'center'}
        gap={1}
      >
        <Txt
          text={category}
          width={560}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={14}
          fontWeight={700}
          letterSpacing={1.5}
        />
        <Txt
          text={item.name}
          width={560}
          fill={THEME.color.text}
          fontFamily={THEME.font.display}
          fontSize={38}
          fontWeight={700}
        />
        <Txt
          text={item.stack.slice(0, 3).join(' · ')}
          width={560}
          fill={THEME.color.muted}
          fontFamily={THEME.font.mono}
          fontSize={15}
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
        fill={THEME.color.muted2}
        fontFamily={THEME.font.mono}
        fontSize={14}
        fontWeight={700}
        letterSpacing={1.2}
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
