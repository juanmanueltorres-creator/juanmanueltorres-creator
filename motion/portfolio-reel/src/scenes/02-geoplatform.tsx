import {Circle, Layout, Line, makeScene2D, Rect, Txt} from '@motion-canvas/2d';
import {all, createRef, waitFor} from '@motion-canvas/core';
import {EditorialHeader} from '../shared/components/EditorialHeader';
import {ScreenshotSurface} from '../shared/components/ScreenshotSurface';
import {TechnicalLabel} from '../shared/components/TechnicalLabel';
import {carouselMetadata, getProject} from '../shared/metadata';
import {MOTION} from '../shared/motion';
import {scanPulse} from '../shared/primitives/ScanPulse';
import {revealScreenshot} from '../shared/primitives/ScreenshotReveal';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  const project = getProject(carouselMetadata, 'geoplatform');
  const domainRow = createRef<Layout>();
  const screenshotFrame = createRef<Rect>();
  const signalCue = createRef<Rect>();
  const pulse = createRef<Circle>();
  const contextRail = createRef<Layout>();

  view.fill(THEME.color.canvas);
  view.add(
    <>
      <Layout y={-535}>
        <EditorialHeader
          eyebrow={'02 / TERRITORIAL INTELLIGENCE'}
          name={project.name}
          status={project.status}
        />
      </Layout>

      <Layout
        ref={domainRow}
        layout
        width={THEME.space.contentWidth}
        height={34}
        y={-405}
        gap={26}
        alignItems={'center'}
        opacity={0}
      >
        <TechnicalLabel text={'MINING'} active />
        <TechnicalLabel text={'SATELLITE'} />
        <TechnicalLabel text={'WEATHER'} />
        <TechnicalLabel text={'SEISMIC'} />
        <TechnicalLabel text={'ROUTES'} />
      </Layout>

      <Rect width={THEME.space.screenshotWidth} height={THEME.space.screenshotHeight} y={-55}>
        <ScreenshotSurface
          screenshot={project.screenshot}
          imagePosition={project.imagePosition}
          frameRef={screenshotFrame}
        />
        <Rect
          ref={signalCue}
          width={THEME.space.screenshotWidth}
          height={THEME.space.screenshotHeight}
          opacity={0}
        >
          <Line
            points={[[-294, -74], [-220, -74]]}
            stroke={THEME.color.accentSoft}
            lineWidth={1}
            opacity={0.55}
          />
          <Line
            points={[[-257, -111], [-257, -37]]}
            stroke={THEME.color.accentSoft}
            lineWidth={1}
            opacity={0.55}
          />
          <Circle
            ref={pulse}
            x={-257}
            y={-74}
            width={12}
            height={12}
            stroke={THEME.color.accent}
            lineWidth={2}
            fill={'#00000000'}
          />
        </Rect>
      </Rect>

      <Layout
        ref={contextRail}
        layout
        width={THEME.space.contentWidth}
        height={74}
        y={330}
        alignItems={'center'}
        justifyContent={'space-between'}
        opacity={0}
      >
        <Layout layout direction={'column'} gap={4} alignItems={'start'}>
          <Txt
            text={'LIVE TERRITORIAL CONTEXT'}
            fill={THEME.color.text}
            fontFamily={THEME.font.sans}
            fontSize={19}
            fontWeight={500}
          />
          <Txt
            text={'ONE PLACE / MULTIPLE VERIFIED CONTEXT LAYERS'}
            fill={THEME.color.muted2}
            fontFamily={THEME.font.mono}
            fontSize={12}
            fontWeight={500}
            letterSpacing={0.45}
          />
        </Layout>
        <Txt
          text={'05 CONTEXT DOMAINS'}
          fill={THEME.color.accent}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
          letterSpacing={0.45}
        />
      </Layout>

      <Layout
        layout
        width={THEME.space.contentWidth}
        height={28}
        y={565}
        alignItems={'center'}
        justifyContent={'space-between'}
      >
        <Txt
          text={'MINING · SATELLITE · WEATHER · SEISMIC · ROUTES'}
          fill={THEME.color.muted2}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={400}
          letterSpacing={0.35}
        />
        <Txt
          text={'02 / 07'}
          fill={THEME.color.accentSoft}
          fontFamily={THEME.font.mono}
          fontSize={13}
          fontWeight={500}
        />
      </Layout>
    </>,
  );

  domainRow().opacity(0);
  signalCue().opacity(0);
  contextRail().opacity(0);

  yield* domainRow().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* all(
    revealScreenshot(screenshotFrame(), MOTION.component, 1.02),
    signalCue().opacity(1, MOTION.component, MOTION.easing.enter),
    scanPulse(pulse(), MOTION.component, 120),
  );
  yield* contextRail().opacity(1, MOTION.component, MOTION.easing.enter);
  yield* waitFor(1.18);
});
