import React, { useEffect } from 'react';
import { a, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const JumpingPlane = ({ trigger }) => {
  const texture = useLoader(THREE.TextureLoader, '/hatter/madhatter.jpg');

  // Set up a spring animation for the plane's position
  const [spring, api] = useSpring(() => ({
    position: [0, 0, 0],
    config: { tension: 170, friction: 12 },
  }));

  useEffect(() => {
    // When the trigger changes, animate the bouncing
    api.start({
      position: [0, 2, 0],
      reset: true,
      onRest: () => {
        api.start({ position: [0, 0, 0] });
      },
    });
  }, [trigger, api]);

  return (
    <a.mesh position={spring.position}>
      {/* Hatter plane */}
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial map={texture} />
    </a.mesh>
  );
};

export default JumpingPlane;
