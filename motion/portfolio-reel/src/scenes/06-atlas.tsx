import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {leftAlignedCenterX, rightAlignedCenterX} from '../shared/layout';
import {carouselMetadata, getProject} from '../shared/metadata';
import {revealText} from '../shared/primitives/RevealText';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {staggerPoints} from '../shared/primitives/StaggerPoints';
import {THEME} from '../shared/theme';

const PROJECT_POINTS = [
  [-320, -190], [-175, -245], [15, -170], [205, -230], [340, -120],
  [-255, 20], [-70, 78], [115, 5], [290, 82],
] as const;

const DIMENSIONS = ['PROVINCE', 'MINERAL', 'STAGE', 'COMPANY', 'CAPITAL'] as const;

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'atlas');
  const field = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const pointRefs = PROJECT_POINTS.map(() => createRef<Circle>());
  const labelRefs = DIMENSIONS.map(() => createRef<Txt>());
  const focal = normalizeFocalPosition(project.imagePosition);

  view.fill(THEME.color.background);
  view.add(
    <>
      <Rect width={1024} height={1294} radius={24} stroke={THEME.color.borderSoft} lineWidth={2} />
      <Txt
        text={project.name}
        x={leftAlignedCenterX(936)}
        y={-570}
        width={936}
        fill={THEME.color.text}
        fontFamily={THEME.font.display}
        fontSize={48}
        fontWeight={700}
        textAlign={'left'}
      />
      <Txt
        text={project.status}
        x={rightAlignedCenterX(460)}
        y={-570}
        width={460}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.2}
        textAlign={'right'}
      />

      <Rect ref={field} y={0} width={936} height={760}>
        <Rect
          width={880}
          height={510}
          radius={28}
          fill={THEME.color.surface}
          stroke={THEME.color.border}
          lineWidth={2}
          opacity={0.78}
        />
        {[-264, -132, 0, 132, 264].map(x => (
          <Line
            points={[[x, -255], [x, 255]]}
            stroke={THEME.color.borderSoft}
            lineWidth={2}
          />
        ))}
        {[-160, -80, 0, 80, 160].map(y => (
          <Line
            points={[[-440, y], [440, y]]}
            stroke={THEME.color.borderSoft}
            lineWidth={2}
          />
        ))}
        <Txt
          text={'ABSTRACT TERRITORIAL FRAME'}
          x={-400}
          y={-210}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={700}
          letterSpacing={1.6}
          textAlign={'left'}
        />
        {PROJECT_POINTS.map(([x, y], index) => {
          const ring = index % 3 === 0;
          return (
            <Circle
              ref={pointRefs[index]}
              x={x}
              y={y}
              width={ring ? 25 : 15 + (index % 3) * 3}
              height={ring ? 25 : 15 + (index % 3) * 3}
              fill={ring ? '#00000000' : THEME.color.text}
              stroke={ring ? THEME.color.accent : undefined}
              lineWidth={ring ? 3 : 0}
              opacity={0}
            />
          );
        })}
        {DIMENSIONS.map((label, index) => (
          <Rect
            x={-340 + index * 170}
            y={305}
            width={150}
            height={42}
            radius={12}
            fill={THEME.color.surfaceRaised}
            stroke={index === DIMENSIONS.length - 1 ? THEME.color.accent : THEME.color.border}
            lineWidth={2}
          >
            <Txt
              ref={labelRefs[index]}
              text={label}
              fill={index === DIMENSIONS.length - 1 ? THEME.color.accent : THEME.color.text}
              fontFamily={THEME.font.mono}
              fontSize={15}
              fontWeight={700}
              letterSpacing={1.1}
              opacity={0}
            />
          </Rect>
        ))}
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
          width={THEME.space.screenshotWidth + 110}
          x={focal.x * 44}
          y={focal.y * 34}
        />
      </Rect>
      <Txt
        text={'ARGENTINE MINING ATLAS · PROJECTS · FILTERS'}
        y={THEME.space.captionY}
        fill={THEME.color.muted}
        fontFamily={THEME.font.mono}
        fontSize={16}
        fontWeight={700}
        letterSpacing={0.7}
      />
    </>,
  );

  yield* staggerPoints(pointRefs.map(ref => ref()), 0.045, 16);
  yield* sequence(
    0.05,
    ...labelRefs.map(label => revealText(label(), 0.16, 6)),
  );
  yield* waitFor(0.08);
  yield* all(
    field().opacity(0.06, 0.32),
    field().scale(0.98, 0.32),
    revealScreenshot(screenshotFrame(), 0.36, 1.018),
  );
  yield* waitFor(0.82);
});
