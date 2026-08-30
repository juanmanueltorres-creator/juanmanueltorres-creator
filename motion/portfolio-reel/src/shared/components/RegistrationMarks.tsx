import {Line, Node} from '@motion-canvas/2d';
import {THEME} from '../theme';

const MARK = 28;
const X = 480;
const Y = 615;

export function RegistrationMarks() {
  return (
    <Node opacity={0.72}>
      <Line points={[[-X, -Y], [-X + MARK, -Y]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[-X, -Y], [-X, -Y + MARK]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[X - MARK, -Y], [X, -Y]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[X, -Y], [X, -Y + MARK]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[-X, Y], [-X + MARK, Y]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[-X, Y - MARK], [-X, Y]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[X - MARK, Y], [X, Y]]} stroke={THEME.color.border} lineWidth={1} />
      <Line points={[[X, Y - MARK], [X, Y]]} stroke={THEME.color.border} lineWidth={1} />
    </Node>
  );
}
