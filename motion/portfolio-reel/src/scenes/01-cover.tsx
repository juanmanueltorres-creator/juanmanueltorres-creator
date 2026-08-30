import {Circle, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
import {CONTENT_LEFT} from '../shared/layout';
import {carouselMetadata} from '../shared/metadata';
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
  const nodeRefs = Array.from({length: 6}, () => createRef<Circle>());

  const routePoints = [
    [-430, -315],
    [-300, -385],
    [-150, -292],
    [10, -360],
    [170, -265],
    [315, -345],
    [430, -275],
  ] as const;

  const nodePoints = [
    routePoints[0],
    routePoints[1],
    routePoints[2],
    routePoints[4],
    routePoints[5],
    routePoints[6],
  ];

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect
        width={1024}
        height={1294}
        radius={24}
        stroke={THEME.color.borderSoft}
        lineWidth={2}
      />

      <Txt
        text={carouselMetadata.cover.eyebrow}
        left={[CONTENT_LEFT, -570]}
        width={936}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={18}
        fontWeight={700}
        letterSpacing={2.4}
        textAlign={'left'}
      />
      <Line
        points={[[-468, -535], [468, -535]]}
        stroke={THEME.color.border}
        lineWidth={2}
      />

      <Line
        ref={route}
        points={routePoints.map(([x, y]) => [x, y])}
        stroke={THEME.color.accent}
        lineWidth={3}
        radius={18}
        opacity={0.82}
      />

      {nodePoints.map((position, index) => (
        <Circle
          ref={nodeRefs[index]}
          x={position[0]}
          y={position[1]}
          width={14}
          height={14}
          fill={THEME.color.background}
          stroke={THEME.color.accent}
          lineWidth={2}
        />
      ))}

      <Line points={[[-315, -245], [-315, -202]]} stroke={THEME.color.border} lineWidth={2} />
      <Line points={[[0, -245], [0, -202]]} stroke={THEME.color.border} lineWidth={2} />
      <Line points={[[315, -245], [315, -202]]} stroke={THEME.color.border} lineWidth={2} />

      <Txt
        ref={territory}
        text={'TERRITORY'}
        x={-315}
        y={-175}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={20}
        fontWeight={700}
        letterSpacing={2.2}
      />
      <Txt
        ref={evidence}
        text={'EVIDENCE'}
        x={0}
        y={-175}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={20}
        fontWeight={700}
        letterSpacing={2.2}
      />
      <Txt
        ref={operations}
        text={'OPERATIONS'}
        x={315}
        y={-175}
        fill={THEME.color.text}
        fontFamily={THEME.font.mono}
        fontSize={20}
        fontWeight={700}
        letterSpacing={2.2}
      />

      <Txt
        ref={title}
        text={carouselMetadata.cover.title}
        left={[CONTENT_LEFT, 60]}
        width={900}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={60}
        fontWeight={700}
        lineHeight={72}
        textWrap
        textAlign={'left'}
      />
      <Txt
        ref={subtitle}
        text={carouselMetadata.cover.subtitle}
        left={[CONTENT_LEFT, 305]}
        width={850}
        fill={THEME.color.muted}
        fontFamily={THEME.font.display}
        fontSize={26}
        lineHeight={37}
        textWrap
        textAlign={'left'}
      />
      <Txt
        ref={footer}
        text={carouselMetadata.cover.footer}
        left={[CONTENT_LEFT, 565]}
        width={936}
        fill={THEME.color.muted2}
        fontFamily={THEME.font.mono}
        fontSize={14}
        fontWeight={700}
        letterSpacing={1.2}
        textAlign={'left'}
      />
    </>,
  );

  territory().opacity(0);
  evidence().opacity(0);
  operations().opacity(0);
  title().opacity(0);
  subtitle().opacity(0);
  footer().opacity(0);

  yield* drawPath(route(), 0.38);
  yield* staggerPoints(nodeRefs.map(ref => ref()), 0.035, 6);
  yield* sequence(
    0.06,
    revealText(territory(), 0.2, 10),
    revealText(evidence(), 0.2, 10),
    revealText(operations(), 0.2, 10),
  );
  yield* all(
    route().opacity(0.3, 0.22),
    ...nodeRefs.map(ref => ref().opacity(0.36, 0.22)),
  );
  yield* sequence(
    0.1,
    revealText(title(), 0.34, 16),
    revealText(subtitle(), 0.34, 12),
  );
  yield* revealText(footer(), 0.22, 6);
  yield* waitFor(0.58);
});
