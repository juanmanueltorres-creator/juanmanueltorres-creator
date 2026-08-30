import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, chain, createRef, sequence, waitFor} from '@motion-canvas/core';
import {RegistrationMarks} from '../shared/components/RegistrationMarks';
import {carouselMetadata} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const route = createRef<Line>();
  const traveler = createRef<Circle>();
  const territory = createRef<Txt>();
  const evidence = createRef<Txt>();
  const operations = createRef<Txt>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const footer = createRef<Txt>();
  const anchorRefs = Array.from({length: 3}, () => createRef<Circle>());

  const routePoints: [number, number][] = [
    [-404, 20],
    [-286, -40],
    [-142, 24],
    [8, -34],
    [162, 38],
    [300, -18],
    [404, 32],
  ];

  const anchorPoints = [routePoints[0], routePoints[3], routePoints[6]];

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <RegistrationMarks />

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={42}
        y={-570}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          text={carouselMetadata.cover.eyebrow}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={15}
          fontWeight={600}
          letterSpacing={1.05}
        />
        <Txt
          text={'MOTION PORTFOLIO / 2026'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
          letterSpacing={0.6}
        />
      </Layout>

      <Rect width={THEME.space.contentWidth} height={230} y={-330}>
        <Line
          ref={route}
          points={routePoints}
          stroke={THEME.color.accentSoft}
          lineWidth={2}
          radius={18}
          opacity={0.82}
        />
        {anchorPoints.map((position, index) => (
          <Circle
            ref={anchorRefs[index]}
            x={position[0]}
            y={position[1]}
            width={index === 1 ? 11 : 9}
            height={index === 1 ? 11 : 9}
            fill={THEME.color.canvas}
            stroke={index === 1 ? THEME.color.accent : THEME.color.accentSoft}
            lineWidth={2}
          />
        ))}
        <Circle
          ref={traveler}
          x={routePoints[0][0]}
          y={routePoints[0][1]}
          width={9}
          height={9}
          fill={THEME.color.accent}
          opacity={0}
        />
      </Rect>

      <Line points={[[-310, -194], [-310, -164]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[0, -194], [0, -164]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[310, -194], [310, -164]]} stroke={THEME.color.border} lineWidth={1} />

      <Txt
        ref={territory}
        text={'TERRITORY'}
        x={-310}
        y={-140}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={500}
        letterSpacing={0.9}
      />
      <Txt
        ref={evidence}
        text={'EVIDENCE'}
        x={0}
        y={-140}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={500}
        letterSpacing={0.9}
      />
      <Txt
        ref={operations}
        text={'OPERATIONS'}
        x={310}
        y={-140}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={500}
        letterSpacing={0.9}
      />

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={280}
        y={100}
        direction={'column'}
        alignItems={'start'}
        justifyContent={'center'}
      >
        <Txt
          ref={title}
          text={'Software built around\nterritory, evidence and\noperations.'}
          fill={THEME.color.text}
          fontFamily={THEME.font.sans}
          fontSize={THEME.type.coverTitle}
          fontWeight={600}
          lineHeight={76}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={100}
        y={375}
        direction={'column'}
        alignItems={'start'}
        justifyContent={'center'}
      >
        <Txt
          ref={subtitle}
          text={'A compact visual atlas of geospatial products,\napplied tools and spatial systems.'}
          fill={THEME.color.muted}
          fontFamily={THEME.font.sans}
          fontSize={22}
          fontWeight={400}
          lineHeight={32}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={34}
        y={566}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          ref={footer}
          text={carouselMetadata.cover.footer}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
          letterSpacing={0.45}
        />
        <Txt
          text={'01 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  territory().opacity(0);
  evidence().opacity(0);
  operations().opacity(0);
  title().opacity(0);
  subtitle().opacity(0);
  footer().opacity(0);
  for (const anchorRef of anchorRefs) {
    anchorRef().opacity(0);
    anchorRef().scale(0.78);
  }

  yield* drawPath(route(), MOTION.component);
  yield* all(
    ...anchorRefs.map(anchorRef =>
      all(
        anchorRef().opacity(0.82, 0.18, MOTION.easing.enter),
        anchorRef().scale(1, 0.18, MOTION.easing.enter),
      ),
    ),
    chain(
      all(
        traveler().opacity(1, 0.06, MOTION.easing.enter),
        traveler().position(routePoints[1], 0.06, MOTION.easing.continuity),
      ),
      ...routePoints
        .slice(2)
        .map(point => traveler().position(point, 0.055, MOTION.easing.continuity)),
      traveler().opacity(0, 0.08, MOTION.easing.continuity),
    ),
  );
  yield* sequence(
    0.05,
    revealText(territory(), 0.18, 8),
    revealText(evidence(), 0.18, 8),
    revealText(operations(), 0.18, 8),
  );
  yield* all(
    route().opacity(0.34, MOTION.micro),
    ...anchorRefs.map(anchorRef => anchorRef().opacity(0.42, MOTION.micro)),
  );
  yield* sequence(
    0.09,
    revealText(title(), MOTION.component, 14),
    revealText(subtitle(), MOTION.component, 10),
  );
  yield* revealText(footer(), 0.2, 5);
  yield* route().opacity(0.18, MOTION.component, MOTION.easing.continuity);
  yield* waitFor(0.38);
});
