import {Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {createRef, sequence, waitFor} from '@motion-canvas/core';
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
  const branches = SYSTEM_ORDER.map(() => createRef<Line>());
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
      <Txt
        text={carouselMetadata.moreSystems.title}
        x={-468}
        y={-475}
        width={900}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={46}
        fontWeight={700}
        lineHeight={58}
        textWrap
        textAlign={'left'}
      />
      <Txt
        text={carouselMetadata.moreSystems.subtitle}
        x={-468}
        y={-360}
        width={880}
        fill={THEME.color.muted}
        fontFamily={THEME.font.display}
        fontSize={24}
        lineHeight={34}
        textWrap
        textAlign={'left'}
      />

      <Line
        points={[[-330, -180], [-330, 400]]}
        stroke={THEME.color.border}
        lineWidth={3}
      />

      {systems.map(({category, item}, index) => {
        const y = -125 + index * 170;
        return (
          <>
            <Line
              ref={branches[index]}
              points={[[-330, y], [-215, y]]}
              stroke={index === systems.length - 1 ? THEME.color.accent : THEME.color.border}
              lineWidth={3}
            />
            <Txt
              ref={categoryRefs[index]}
              text={category}
              x={-120}
              y={y - 22}
              width={180}
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
              x={80}
              y={y + 5}
              width={560}
              fill={THEME.color.text}
              fontFamily={THEME.font.display}
              fontSize={34}
              fontWeight={700}
              textAlign={'left'}
              opacity={0}
            />
            <Txt
              ref={stackRefs[index]}
              text={item.stack.slice(0, 3).join(' · ')}
              x={80}
              y={y + 48}
              width={560}
              fill={THEME.color.muted}
              fontFamily={THEME.font.mono}
              fontSize={14}
              textAlign={'left'}
              opacity={0}
            />
          </>
        );
      })}

      <Txt
        text={'github.com/juanmanueltorres-creator'}
        x={-468}
        y={570}
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

  for (const branch of branches) branch().end(0);

  for (let index = 0; index < systems.length; index += 1) {
    yield* drawPath(branches[index](), 0.18);
    yield* sequence(
      0.04,
      revealText(categoryRefs[index](), 0.16, 7),
      revealText(nameRefs[index](), 0.2, 9),
      revealText(stackRefs[index](), 0.16, 6),
    );
  }

  yield* waitFor(0.46);
});
