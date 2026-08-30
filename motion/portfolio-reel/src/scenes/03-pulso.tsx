import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {CONTENT_LEFT, CONTENT_RIGHT} from '../shared/layout';
import {carouselMetadata, getProject} from '../shared/metadata';
import {revealText} from '../shared/primitives/RevealText';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {THEME} from '../shared/theme';

const SIGNAL_POINTS = [
  [-365, -190], [-255, -95], [-130, -220], [10, -125], [165, -220], [325, -125],
  [-305, 70], [-170, 140], [-20, 45], [130, 125], [265, 35], [365, 150],
] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'pulso');
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = SIGNAL_POINTS.map(() => createRef<Circle>());
  const signal = createRef<Txt>();
  const source = createRef<Txt>();
  const freshness = createRef<Txt>();
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />
      <Txt
        text={project.name}
        left={[CONTENT_LEFT, -570]}
        width={936}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        textAlign={'left'}
      />
      <Txt
        text={project.status}
        right={[CONTENT_RIGHT, -570]}
        width={420}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.4}
        textAlign={'right'}
      />

      <Rect ref={field} y={0} width={936} height={760}>
        <Rect
          width={880}
          height={510}
          radius={28}
          stroke={THEME.color.border}
          lineWidth={2}
          fill={THEME.color.surface}
          opacity={0.76}
        />
        <Txt
          text={'ABSTRACT SIGNAL FIELD'}
          x={-395}
          y={-210}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={700}
          letterSpacing={1.6}
          textAlign={'left'}
        />
        {SIGNAL_POINTS.map(([x, y], index) => {
          const ring = index % 4 === 0;
          return (
            <Circle
              ref={pointRefs[index]}
              x={x}
              y={y}
              width={ring ? 26 : 16 + (index % 3) * 4}
              height={ring ? 26 : 16 + (index % 3) * 4}
              fill={ring ? '#00000000' : (index % 3 === 0 ? THEME.color.accent : THEME.color.text)}
              stroke={ring ? THEME.color.accent : undefined}
              lineWidth={ring ? 3 : 0}
              opacity={0}
            />
          );
        })}

        <Txt
          ref={signal}
          text={'SIGNAL'}
          x={-280}
          y={300}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={19}
          fontWeight={700}
          letterSpacing={1.6}
          opacity={0}
        />
        <Line points={[[-190, 300], [-95, 300]]} stroke={THEME.color.border} lineWidth={3} endArrow />
        <Txt
          ref={source}
          text={'SOURCE'}
          x={0}
          y={300}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={19}
          fontWeight={700}
          letterSpacing={1.6}
          opacity={0}
        />
        <Line points={[[90, 300], [185, 300]]} stroke={THEME.color.border} lineWidth={3} endArrow />
        <Txt
          ref={freshness}
          text={'FRESHNESS'}
          x={300}
          y={300}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={19}
          fontWeight={700}
          letterSpacing={1.6}
          opacity={0}
        />
      </Rect>

      <Rect
        ref={screenshotFrame}
        y={THEME.space.screenshotY}
        width={THEME.space.screenshotWidth}
        height={THEME.space.screenshotHeight}
        radius={24}
        clip
        fill={THEME.color.surface}
        stroke={THEME.color.border}
        lineWidth={2}
        opacity={0}
      >
        <Img
          src={ASSET_URLS[project.screenshot]}
          width={THEME.space.screenshotWidth + 120}
          x={focal.x * 44}
          y={focal.y * 34}
        />
      </Rect>
      <Txt
        text={'EARTHQUAKES · THERMAL · WEATHER · SOURCE · FRESHNESS'}
        y={THEME.space.captionY}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={0.7}
      />
    </>,
  );

  yield* staggerPoints(pointRefs.map(ref => ref()), 0.04, 16);
  yield* sequence(
    0.065,
    revealText(signal(), 0.18, 8),
    revealText(source(), 0.18, 8),
    revealText(freshness(), 0.18, 8),
  );
  yield* waitFor(0.08);
  yield* all(
    field().opacity(0.06, 0.32),
    field().scale(0.98, 0.32),
    revealScreenshot(screenshotFrame(), 0.36, 1.018),
  );
  yield* waitFor(0.82);
});
