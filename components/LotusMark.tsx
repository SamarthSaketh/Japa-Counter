import React from 'react';
import Svg, { Path } from 'react-native-svg';

/**
 * The small lotus glyph used as a divider/watermark on profile cards,
 * echoing the recurring lotus mark in the reference screenshots.
 */
export default function LotusMark({
  size = 18,
  color = '#FFFFFF',
  opacity = 0.9,
}: {
  size?: number;
  color?: string;
  opacity?: number;
}) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" opacity={opacity}>
      <Path
        d="M12 2c1.2 3 1.6 6.2 0 9-1.6-2.8-1.2-6 0-9Z"
        fill={color}
      />
      <Path
        d="M12 22c-4.5-.3-7.5-2.9-8-6.7 3.4.2 6.4 2.4 8 6.7Z"
        fill={color}
      />
      <Path
        d="M12 22c4.5-.3 7.5-2.9 8-6.7-3.4.2-6.4 2.4-8 6.7Z"
        fill={color}
      />
      <Path
        d="M12 22c-3.2-2.6-4.6-6-3.6-9.6 3 1.8 4.6 5.3 3.6 9.6Z"
        fill={color}
      />
      <Path
        d="M12 22c3.2-2.6 4.6-6 3.6-9.6-3 1.8-4.6 5.3-3.6 9.6Z"
        fill={color}
      />
    </Svg>
  );
}
