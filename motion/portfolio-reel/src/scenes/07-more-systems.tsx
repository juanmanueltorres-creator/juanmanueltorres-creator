import {Circle, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {CONTENT_LEFT} from '../shared/layout';
import {carouselMetadata} from '../shared/metadata';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
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
  const categoryRefs = SYSTEM_ORDER.map(() => createRef<Txt>());
  const nameRefs = SYSTEM_ORDER.map(() => createRef<Txt>());
  const stackRefs = SYSTEM_ORDER.map(() => createRef<Txt>());

  const systems = SYSTEM_ORDER.map(([category, name]) => {
    const item = carouselMetadata.moreSystems.items.find(candidate => candidate.name === name);
    if (!item) {
      throw new Error(`more system '${name}' not found in canonical metadata`);
    }
    return {category, item};
  });

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />
      <Txt
        text={carouselMetadata.moreSystems.eyebrow}
        left={[CONTENT_LEFT, -570]}
        width={936}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={18}
        fontWeight={700}
        letterSpacing={2.4}
        textAlign={'left'}
      />
      <Txt
        text={carouselMetadata.moreSystems.title}
        left={[CONTENT_LEFT, -470]}
        width={900}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        lineHeight={60}
        textWrap
        textAlign={'left'}
      />

      <Line
        ref={spine}
        points={[[-330, -285], [-330, 410]]}
        stroke={THEME.color.border}
        lineWidth={3}
      />

      {systems.map(({category, item}, index) => {
        const y = -210 + index * 175;
        return (
          <>
            <Line
              ref={branches[index]}
              points={[[-330, y], [-215, y]]}
              stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.border}
              lineWidth={3}
            />
            <Circle
              ref={endpointRefs[index]}
              x={-205}
              y={y}
              width={13}
              height={13}
              fill={THEME.color.background}
              stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.text}
              lineWidth={2}
            />
            <Txt
              ref={categoryRefs[index]}
              text={category}
              x={-105}
              y={y - 24}
              width={190}
              fill={THEME.color.muted2}
              fontFamily={THEME.font.mono}
              fontSize={14}
              fontWeight={700}
              letterSpacing={1.5}
              textAlign={'left'}
              opacity={0}
            />
            <Txt
              ref={nameRefs[index]}
              text={item.name}
              x={105}
              y={y + 4}
              width={560}
              fill={THEME.color.text}
              fontFamily={THEME.font.display}
              fontSize={38}
              fontWeight={700}
              textAlign={'left'}
              opacity={0}
            />
            <Txt
              ref={stackRefs[index]}
              text={item.stack.slice(0, 3).join(' · ')}
              x={105}
              y={y + 51}
              width={560}
              fill={THEME.color.muted}
              fontFamily={THEME.font.mono}
              fontSize={15}
              textAlign={'left'}
              opacity={0}
            />
          </>
        );
      })}

      <Txt
        text={'github.com/juanmanueltorres-creator'}
        left={[CONTENT_LEFT, 570]}
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

  spine().end(0);
  for (const branch of branches) branch().end(0);
  for (const endpoint of endpointRefs) endpoint().opacity(0);

  yield* drawPath(spine(), 0.34);

  for (let index = 0; index < systems.length; index += 1) {
    yield* all(
      drawPath(branches[index](), 0.16),
      endpointRefs[index]().opacity(1, 0.12),
    );
    yield* sequence(
      0.035,
      revealText(categoryRefs[index](), 0.14, 6),
      revealText(nameRefs[index](), 0.18, 7),
      revealText(stackRefs[index](), 0.14, 5),
    );
  }

  yield* waitFor(0.58);
});
