import React, { useState, useEffect } from 'react';
import { a, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const MovingCharacter = ({ trigger }) => {
  // Load textures for different body parts (ensure these PNGs are in your public folder)
  const originalHeadTexture = useLoader(THREE.TextureLoader, '/hatter/hatterhead1.png');
  const talkingHeadTexture = useLoader(THREE.TextureLoader, '/hatter/hatterhead2.png');
  const bodyTexture = useLoader(THREE.TextureLoader, '/hatter/hatterbody1.png');
  const armTexture = useLoader(THREE.TextureLoader, '/hatter/hatterarm.png');
// Use local state to track which head texture to display.
const [currentHeadTexture, setCurrentHeadTexture] = useState(originalHeadTexture);

 // Spring for group jump animation.
 const [groupSpring, groupApi] = useSpring(() => ({
    position: [0, 0, 0],
    config: { tension: 170, friction: 12 },
  }));

  // Spring for head rotation ("waving").
  const [headSpring, headApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 200, friction: 10 },
  }));

  // Spring for arm rotation ("waving").
  const [armSpring, armApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 200, friction: 10 },
  }));

  // Jump animation for the entire group.
  useEffect(() => {
    groupApi.start({
      position: [0, 2, 0],
      reset: true,
      onRest: () => groupApi.start({ position: [0, 0, 0] }),
    });
  }, [trigger, groupApi]);

  // Change head texture to talking texture, then revert after 1 second.
  useEffect(() => {
    setCurrentHeadTexture(talkingHeadTexture);
    const timeout = setTimeout(() => {
      setCurrentHeadTexture(originalHeadTexture);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [trigger, originalHeadTexture, talkingHeadTexture]);

  // Head wave animation when trigger updates.
  useEffect(() => {
    headApi.start({
      rotation: [0, 0, 0.3],
      reset: true,
      onRest: () => headApi.start({ rotation: [0, 0, 0] }),
    });
  }, [trigger, headApi]);

  // Arm wave animation when trigger updates.
  useEffect(() => {
    armApi.start({
      rotation: [0, 0, -0.3],
      reset: true,
      onRest: () => armApi.start({ rotation: [0, 0, 0] }),
    });
  }, [trigger, armApi]);

  return (
    <a.group position={groupSpring.position}>
      {/* Head with animated rotation */}
      <a.mesh position={[0, 0, 0]} rotation={headSpring.rotation}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={currentHeadTexture} transparent={true} />
      </a.mesh>

      {/* Body stays static */}
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={bodyTexture} transparent={true} />
      </mesh>

      {/* Arm with animated rotation */}
      <a.mesh position={[0, 0, 0]} rotation={armSpring.rotation}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={armTexture} transparent={true} />
      </a.mesh>
    </a.group>
  );
};

export default MovingCharacter;
