import Svg, { Path } from 'react-native-svg';

type IconProps = {
  size?: number;
  color?: string;
};

/** Edit FAB on profile avatar (no separate asset). */
export function PencilEditIcon({
  size = 16,
  color = '#ffffff',
}: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path
        d="M4 20.75 4 17l9.5-9.5 3.75 3.75L7.75 20.5H4v.25Z"
        stroke={color}
        strokeWidth={1.8}
        strokeLinejoin="round"
      />
      <Path
        d="m14.5 6.5 3 3"
        stroke={color}
        strokeWidth={1.8}
        strokeLinecap="round"
      />
    </Svg>
  );
}
