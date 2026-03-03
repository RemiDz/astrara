import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Astrara — Your Cosmic Frequency Portrait';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(180deg, #04040A 0%, #0A0B14 50%, #0F1019 100%)',
          fontFamily: 'serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <p
            style={{
              fontSize: '18px',
              letterSpacing: '0.3em',
              color: '#6B7194',
              textTransform: 'uppercase',
            }}
          >
            ASTRARA
          </p>
          <h1
            style={{
              fontSize: '48px',
              color: '#E8ECF4',
              fontStyle: 'italic',
            }}
          >
            Your Cosmic Frequency Portrait
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '24px',
            }}
          >
            {['#FCD34D', '#E2E8F0', '#A5B4FC', '#F9A8D4', '#EF4444', '#FB923C', '#A78BFA', '#22D3EE', '#6366F1', '#9CA3AF'].map(
              (color, i) => (
                <div
                  key={i}
                  style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    backgroundColor: color,
                  }}
                />
              )
            )}
          </div>
          <p
            style={{
              fontSize: '14px',
              color: '#3D4167',
              marginTop: '12px',
            }}
          >
            astrara.app
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
