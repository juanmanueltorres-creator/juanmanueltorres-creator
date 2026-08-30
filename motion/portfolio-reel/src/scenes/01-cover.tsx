import {makeScene2D, Txt} from '@motion-canvas/2d';
import {waitFor} from '@motion-canvas/core';
import {carouselMetadata} from '../shared/metadata';
import {THEME} from '../shared/theme';

export default makeScene2D(function* (view) {
  view.fill(THEME.color.background);
  view.add(
    <Txt
      text={carouselMetadata.cover.title}
      fill={THEME.color.text}
      fontFamily={THEME.font.display}
      fontSize={64}
      width={900}
      textWrap
      textAlign={'left'}
    />,
  );
  yield* waitFor(1);
});
