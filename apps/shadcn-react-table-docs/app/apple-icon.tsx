import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/** Same mark as app/icon.svg: two slanted emerald strokes on black. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: '#000',
        }}
      >
        <svg width="180" height="180" viewBox="0 0 32 32">
          <path d="M7 25h4l6-18h-4zM15 25h4l6-18h-4z" fill="#00d492" />
        </svg>
      </div>
    ),
    size,
  );
}
