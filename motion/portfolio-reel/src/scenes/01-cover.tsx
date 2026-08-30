import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {RegistrationMarks} from '../shared/components/RegistrationMarks';
import {carouselMetadata} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const route = createRef<Line>();
  const territory = createRef<Txt>();
  const evidence = createRef<Txt>();
  const operations = createRef<Txt>();
  const title = createRef<Txt>();
  const subtitle = createRef<Txt>();
  const footer = createRef<Txt>();
  const frame = createRef<Rect>();
  const nodeRefs = Array.from({length: 6}, () => createRef<Circle>());

  const routePoints = [
    [-410, -322],
    [-290, -382],
    [-138, -300],
    [16, -362],
    [168, -276],
    [306, -342],
    [414, -286],
  ] as const;

  const nodePoints = [
    routePoints[0],
    routePoints[1],
    routePoints[2],
    routePoints[4],
    routePoints[5],
    routePoints[6],
  ];

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Rect
        ref={frame}
        width={1024}
        height={1294}
        radius={24}
        fill={THEME.color.workspace}
        stroke={THEME.color.borderSoft}
        lineWidth={1}
      />
      <RegistrationMarks />

      <Layout
        layout
        width={936}
        height={42}
        y={-570}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          text={carouselMetadata.cover.eyebrow}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={THEME.type.eyebrow}
          fontWeight={600}
          letterSpacing={2}
        />
        <Txt
          text={'MOTION PORTFOLIO / 2026'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={THEME.type.micro}
          fontWeight={500}
          letterSpacing={1.2}
        />
      </Layout>
      <Line
        points={[[-468, -536], [468, -536]]}
        stroke={THEME.color.borderSoft}
        lineWidth={1}
      />

      <Rect
        width={936}
        height={330}
        y={-305}
        radius={18}
        fill={THEME.color.canvas}
        stroke={THEME.color.borderSoft}
        lineWidth={1}
      >
        <Line
          ref={route}
          points={routePoints.map(([x, y]) => [x, y + 305])}
          stroke={THEME.color.accent}
          lineWidth={3}
          radius={18}
          opacity={0.86}
        />
        {nodePoints.map((position, index) => (
          <Circle
            ref={nodeRefs[index]}
            x={position[0]}
            y={position[1] + 305}
            width={12}
            height={12}
            fill={THEME.color.canvas}
            stroke={THEME.color.accent}
            lineWidth={2}
          />
        ))}
      </Rect>

      <Line points={[[-310, -116], [-310, -82]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[0, -116], [0, -82]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[310, -116], [310, -82]]} stroke={THEME.color.border} lineWidth={1} />

      <Txt
        ref={territory}
        text={'TERRITORY'}
        x={-310}
        y={-56}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={600}
        letterSpacing={1.8}
      />
      <Txt
        ref={evidence}
        text={'EVIDENCE'}
        x={0}
        y={-56}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={600}
        letterSpacing={1.8}
      />
      <Txt
        ref={operations}
        text={'OPERATIONS'}
        x={310}
        y={-56}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={600}
        letterSpacing={1.8}
      />

      <Layout
        layout
        width={936}
        height={280}
        y={154}
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
        width={936}
        height={100}
        y={402}
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
        width={936}
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
          letterSpacing={0.8}
        />
        <Txt
          text={'01 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={600}
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

  yield* drawPath(route(), MOTION.component);
  yield* staggerPoints(nodeRefs.map(ref => ref()), 0.03, 6);
  yield* sequence(
    0.05,
    revealText(territory(), 0.18, 8),
    revealText(evidence(), 0.18, 8),
    revealText(operations(), 0.18, 8),
  );
  yield* all(
    route().opacity(0.34, MOTION.micro),
    ...nodeRefs.map(ref => ref().opacity(0.4, MOTION.micro)),
  );
  yield* sequence(
    0.09,
    revealText(title(), MOTION.component, 14),
    revealText(subtitle(), MOTION.component, 10),
  );
  yield* revealText(footer(), 0.2, 5);
  yield* all(
    frame().stroke(THEME.color.border, MOTION.component, MOTION.easing.continuity),
    route().opacity(0.18, MOTION.component, MOTION.easing.continuity),
  );
  yield* waitFor(0.42);
});
