import { ImageResponse } from 'next/og';

export const alt =
  'Tadex — Automated Telegram Signal Execution for Crypto Traders';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#000000',
          padding: '64px 72px',
          color: '#FFFFFF',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top Row: Tadex Brand Mark + Pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '18px',
                backgroundColor: '#181818',
                border: '2px solid #313131',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg
                width="48"
                height="48"
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
            <span
              style={{
                fontSize: '36px',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: '#FFFFFF',
              }}
            >
              Tadex
            </span>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              backgroundColor: '#181818',
              border: '1px solid #313131',
              borderRadius: '9999px',
              padding: '10px 22px',
              fontSize: '18px',
              color: '#2DD4BF',
              fontWeight: 600,
            }}
          >
            <span>Non-Custodial • Trade-Only API • 24/7 Automation</span>
          </div>
        </div>

        {/* Center Headline & Subheadline */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            maxWidth: '980px',
          }}
        >
          <div
            style={{
              fontSize: '64px',
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: '-0.03em',
              color: '#FFFFFF',
            }}
          >
            Never Miss a Profitable Signal Again.
          </div>
          <div
            style={{
              fontSize: '28px',
              lineHeight: 1.4,
              color: '#BABABA',
            }}
          >
            Connect your Telegram signal groups and crypto exchanges. Tadex reads signals and executes trades automatically with your risk rules.
          </div>
        </div>

        {/* Bottom Trust Strip */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#181818',
            border: '1px solid #313131',
            borderRadius: '20px',
            padding: '22px 32px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', color: '#7B7B7B' }}>
                EXECUTION SPEED
              </span>
              <span
                style={{ fontSize: '24px', fontWeight: 700, color: '#2DD4BF' }}
              >
                &lt; 250ms Auto-Fill
              </span>
            </div>
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: '#313131',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', color: '#7B7B7B' }}>
                CUSTODY MODEL
              </span>
              <span
                style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}
              >
                Funds Stay on Your Exchange
              </span>
            </div>
            <div
              style={{
                width: '1px',
                height: '40px',
                backgroundColor: '#313131',
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '15px', color: '#7B7B7B' }}>
                BUILT FOR AFRICA &amp; BEYOND
              </span>
              <span
                style={{ fontSize: '24px', fontWeight: 700, color: '#FFFFFF' }}
              >
                NGN • KES • GHS • USD
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
