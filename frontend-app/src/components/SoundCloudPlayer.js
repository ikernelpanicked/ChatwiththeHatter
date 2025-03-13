import React, { useState, useEffect } from 'react';
import { Html } from '@react-three/drei';

const SoundCloudPlayer = ({ autoplay = false, initialPosition, scale = 0.45 }) => {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Trigger fade-in after the component mounts (slow fade in: 3000ms)
    setFade(true);
  }, []);

  const iframeSrc = `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/99566876&color=%237f8d84&auto_play=${
    autoplay ? 'true' : 'false'
  }&hide_related=false&show_comments=true&show_user=true&show_reposts=false&show_teaser=true`;

  return (
    <group position={initialPosition || [0, 0, 0]}>
      <Html transform>
        {/* Outer container with fixed base dimensions */}
        <div
          style={{
            width: '500px',
            height: '200px',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            userSelect: 'none',
            borderRadius: '10px',
            overflow: 'hidden',
            opacity: fade ? 1 : 0,
            transition: 'opacity 3000ms ease',
            // Wrap inner content in a scaling transform
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
        >
          {/* Vignette overlay */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
            }}
          />
          <iframe
            width="500"
            height="166"
            scrolling="no"
            frameBorder="no"
            allow="autoplay"
            src={iframeSrc}
            title="SoundCloud Player"
          ></iframe>
          <div
            style={{
              fontSize: '10px',
              color: '#cccccc',
              lineBreak: 'anywhere',
              wordBreak: 'normal',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              fontFamily:
                'Interstate,Lucida Grande,Lucida Sans Unicode,Lucida Sans,Garuda,Verdana,Tahoma,sans-serif',
              fontWeight: 100,
            }}
          >
            <a
              href="https://soundcloud.com/frtnk"
              title="FRTNK"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#cccccc', textDecoration: 'none' }}
            >
              FRTNK
            </a>{' '}
            ·{' '}
            <a
              href="https://soundcloud.com/frtnk/white-rabbit-jefferson"
              title="White Rabbit (jefferson Airplane Cover)"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#cccccc', textDecoration: 'none' }}
            >
              White Rabbit (jefferson Airplane Cover)
            </a>
          </div>
        </div>
      </Html>
    </group>
  );
};

export default SoundCloudPlayer;
