import {Circle, Img, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, sequence, waitFor} from '@motion-canvas/core';
import {ASSET_URLS} from '../shared/assets';
import {leftAlignedCenterX, rightAlignedCenterX} from '../shared/layout';
import {carouselMetadata, getProject} from '../shared/metadata';
import {drawPath} from '../shared/primitives/DrawPath';
import {revealText} from '../shared/primitives/RevealText';
import {
  normalizeFocalPosition,
  revealScreenshot,
} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'anti-ia');
  const concept = createRef<Rect>();
  const screenshotFrame = createRef<Rect>();
  const coordinate = createRef<Txt>();
  const notKnowledge = createRef<Txt>();
  const data = createRef<Txt>();
  const evidence = createRef<Txt>();
  const question = createRef<Txt>();
  const thesis = createRef<Txt>();
  const dataToEvidence = createRef<Line>();
  const evidenceToQuestion = createRef<Line>();
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
        x={rightAlignedCenterX(420)}
        y={-570}
        width={420}
        fill={THEME.color.accent}
        fontFamily={THEME.font.mono}
        fontSize={15}
        fontWeight={700}
        letterSpacing={1.4}
        textAlign={'right'}
      />

      <Rect ref={concept} y={-20} width={936} height={760}>
        <Circle
          x={-365}
          y={-205}
          width={22}
          height={22}
          fill={THEME.color.accent}
        />
        <Txt
          ref={coordinate}
          text={'COORDINATE'}
          x={-195}
          y={-205}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={26}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />
        <Txt
          ref={notKnowledge}
          text={'≠  KNOWLEDGE'}
          x={245}
          y={-205}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={26}
          fontWeight={700}
          letterSpacing={1.8}
          opacity={0}
        />

        <Txt
          ref={data}
          text={'DATA'}
          x={-300}
          y={55}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={24}
          fontWeight={700}
          opacity={0}
        />
        <Txt
          ref={evidence}
          text={'EVIDENCE'}
          x={0}
          y={55}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={24}
          fontWeight={700}
          opacity={0}
        />
        <Txt
          ref={question}
          text={'QUESTION'}
          x={305}
          y={55}
          fill={THEME.color.text}
          fontFamily={THEME.font.mono}
          fontSize={24}
          fontWeight={700}
          opacity={0}
        />
        <Line
          ref={dataToEvidence}
          points={[[-225, 55], [-105, 55]]}
          stroke={THEME.color.accent}
          lineWidth={3}
          endArrow
        />
        <Line
          ref={evidenceToQuestion}
          points={[[110, 55], [215, 55]]}
          stroke={THEME.color.accent}
          lineWidth={3}
          endArrow
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
          width={THEME.space.screenshotWidth + 110}
          x={focal.x * 44}
          y={focal.y * 34}
        />
      </Rect>

      <Txt
        ref={thesis}
        text={'Una coordenada no es un punto.'}
        y={THEME.space.captionY}
        width={850}
        fill={THEME.color.muted}
        fontFamily={THEME.font.display}
        fontSize={34}
        fontStyle={'italic'}
        textAlign={'center'}
        opacity={0}
      />
    </>,
  );

  dataToEvidence().end(0);
  evidenceToQuestion().end(0);

  yield* sequence(
    0.1,
    revealText(coordinate(), 0.26, 8),
    revealText(notKnowledge(), 0.3, 8),
  );
  yield* sequence(
    0.075,
    revealText(data(), 0.22, 8),
    revealText(evidence(), 0.22, 8),
    revealText(question(), 0.22, 8),
  );
  yield* all(
    drawPath(dataToEvidence(), 0.24),
    drawPath(evidenceToQuestion(), 0.3),
  );
  yield* revealText(thesis(), 0.3, 10);
  yield* waitFor(0.08);
  yield* all(
    concept().opacity(0.06, 0.32),
    concept().scale(0.97, 0.32),
    revealScreenshot(screenshotFrame(), 0.38, 1.018),
  );
  yield* waitFor(0.82);
});
