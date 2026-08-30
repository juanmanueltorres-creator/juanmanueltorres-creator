import {Circle, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {
  all,
  createRef,
  sequence,
  waitFor,
} from '@motion-canvas/core';
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
  const nodeRefs = Array.from({length: 5}, () => createRef<Circle>());

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
        x={-468}
        y={-570}
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
        points={[
          [-420, -315],
          [-285, -390],
          [-120, -285],
          [55, -360],
          [215, -250],
          [400, -330],
        ]}
        stroke={THEME.color.accent}
        lineWidth={3}
        radius={16}
        opacity={0.72}
      />

      {[
        [-420, -315],
        [-285, -390],
        [-120, -285],
        [215, -250],
        [400, -330],
      ].map((position, index) => (
        <Circle
          ref={nodeRefs[index]}
          x={position[0]}
          y={position[1]}
          width={12}
          height={12}
          fill={THEME.color.background}
          stroke={THEME.color.accent}
          lineWidth={2}
        />
      ))}

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
        x={-468}
        y={80}
        width={870}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={62}
        fontWeight={700}
        lineHeight={76}
        textWrap
        textAlign={'left'}
      />
      <Txt
        ref={subtitle}
        text={carouselMetadata.cover.subtitle}
        x={-468}
        y={330}
        width={840}
        fill={THEME.color.muted}
        fontFamily={THEME.font.display}
        fontSize={28}
        lineHeight={39}
        textWrap
        textAlign={'left'}
      />
      <Txt
        ref={footer}
        text={carouselMetadata.cover.footer}
        x={-468}
        y={565}
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

  yield* drawPath(route(), 0.42);
  yield* staggerPoints(nodeRefs.map(ref => ref()), 0.04, 5);
  yield* sequence(
    0.08,
    revealText(territory(), 0.24, 12),
    revealText(evidence(), 0.24, 12),
    revealText(operations(), 0.24, 12),
  );
  yield* all(
    revealText(title(), 0.38, 18),
    revealText(subtitle(), 0.42, 14),
  );
  yield* revealText(footer(), 0.25, 8);
  yield* waitFor(0.52);
});
