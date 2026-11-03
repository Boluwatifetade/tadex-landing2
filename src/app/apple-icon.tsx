import { ImageResponse } from 'next/og';

export const size = {
  width: 180,
  height: 180,
};
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#181818',
          borderRadius: '40px',
          border: '4px solid #313131',
        }}
      >
        <svg
          width="136"
          height="136"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M52.5 14.5C54.3 12.7 57.5 14 57.5 16.6V49.5C57.5 55.8 55.0 61.9 50.5 66.4L29.6 87.3C28.1 88.8 26.1 89.6 24.0 89.6H15.2C12.5 89.6 11.2 86.4 13.1 84.5L36.8 60.8C39.2 58.4 40.5 55.2 40.5 51.8V41.5H27.8C25.1 41.5 23.8 38.3 25.7 36.4L52.5 14.5Z"
            fill="#2DD4BF"
          />
          <path
            d="M82.4 31.2C84.3 29.3 87.5 30.6 87.5 33.3V43.2C87.5 45.3 86.7 47.3 85.2 48.8L62.0 72.0V53.8C62.0 51.7 62.8 49.7 64.3 48.2L82.4 31.2Z"
            fill="#FFFFFF"
          />
          <path
            d="M82.4 51.8C84.3 49.9 87.5 51.2 87.5 53.9V63.6C87.5 65.7 86.7 67.7 85.2 69.2L66.8 87.6C65.3 89.1 63.3 89.6 61.2 89.6H46.2C43.5 89.6 42.2 86.4 44.1 84.5L82.4 51.8Z"
            fill="#FFFFFF"
          />
          <path
            d="M82.4 72.4C84.3 70.5 87.5 71.8 87.5 74.5V79.2C87.5 85.0 82.8 89.6 77.0 89.6H69.8C67.1 89.6 65.8 86.4 67.7 84.5L82.4 72.4Z"
            fill="#BABABA"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
