import React, { useState, useEffect, useRef } from 'react';
import { a, useSpring } from '@react-spring/three';
import { useLoader, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const MovingCharacter = ({ trigger }) => {
  // Load textures for different body parts (ensure these PNGs are in your public folder)
  const originalHeadTexture = useLoader(THREE.TextureLoader, '/hatter/hatterhead1.png');
  const talkingHeadTexture  = useLoader(THREE.TextureLoader, '/hatter/hatterhead2.png');
  const blinkingHeadTexture = useLoader(THREE.TextureLoader, '/hatter/hatterhead1_blink.png');
  const bodyTexture         = useLoader(THREE.TextureLoader, '/hatter/hatterbody1.png');
  const armTexture          = useLoader(THREE.TextureLoader, '/hatter/hatterarm.png');


  const [currentHeadTexture, setCurrentHeadTexture] = useState(originalHeadTexture);
  const [isHeadFlipped, setIsHeadFlipped] = useState(false);

  // Springs for animations
  const [groupSpring, groupApi] = useSpring(() => ({
    position: [0, 0, 0],
    config: { tension: 170, friction: 12 },
  }));

  const [headSpring, headApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 200, friction: 10 },
  }));

  const [armSpring, armApi] = useSpring(() => ({
    rotation: [0, 0, 0],
    config: { tension: 200, friction: 10 },
  }));

  const bodyRef = useRef();
  const armRef = useRef();

  // Jump animation for the entire group.
  useEffect(() => {
    groupApi.start({
      position: [0, 1, 0],
      reset: true,
      onRest: () => groupApi.start({ position: [0, 0, 0] }),
    });
  }, [trigger, groupApi]);

  // Change head texture to talking texture, then revert after 1 second.
  useEffect(() => {
    if (trigger) {
      setCurrentHeadTexture(talkingHeadTexture);
      const timeout = setTimeout(() => {
        setCurrentHeadTexture(originalHeadTexture);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [trigger, originalHeadTexture, talkingHeadTexture]);

  // Head wave animation when trigger updates.
  useEffect(() => {
    if (trigger) {
      headApi.start({
        rotation: [0, 0, 0.3],
        reset: true,
        onRest: () => headApi.start({ rotation: [0, 0, 0] }),
      });
    }
  }, [trigger, headApi]);

  // Arm wave animation when trigger updates.
  useEffect(() => {
    if (trigger) {
      armApi.start({
        rotation: [0, 0, -0.3],
        reset: true,
        onRest: () => armApi.start({ rotation: [0, 0, 0] }),
      });
    }
  }, [trigger, armApi]);

  // Idle blinking effect: randomly blink by switching head textures
  useEffect(() => {
    let blinkTimeout;
    const blink = () => {
      if (currentHeadTexture === originalHeadTexture) {
        setCurrentHeadTexture(blinkingHeadTexture);
        setTimeout(() => {
          setCurrentHeadTexture(originalHeadTexture);
          blinkTimeout = setTimeout(blink, 3000 + Math.random() * 5000);
        }, 200);
      } else {
        blinkTimeout = setTimeout(blink, 3000 + Math.random() * 5000);
      }
    };
    blinkTimeout = setTimeout(blink, 3000 + Math.random() * 5000);
    return () => clearTimeout(blinkTimeout);
  }, [currentHeadTexture, originalHeadTexture, blinkingHeadTexture]);

  // Breathing animation for the body (chest softly expands)
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (bodyRef.current) {
      const scale = 1 + 0.02 * Math.sin(t * 2); 
      bodyRef.current.scale.set(scale, scale, 1);
    }
  });

  // Random head flip effect
  useEffect(() => {
    let flipTimer;
    const flipHead = () => {
      setIsHeadFlipped(prev => !prev);
      const nextDelay = 3000 + Math.random() * 4000; 
      flipTimer = setTimeout(flipHead, nextDelay);
    };
    flipTimer = setTimeout(flipHead, 3000 + Math.random() * 4000);
    return () => clearTimeout(flipTimer);
  }, []);

  // Idle arm up-and-down movement
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (armRef.current) {
      const amplitude = 0.03;  
      const frequency = 1;     
      armRef.current.position.y = amplitude * Math.sin(t * frequency);
    }
  });

  return (
    <a.group position={groupSpring.position}>
      {/* Head with animated rotation and random horizontal flip */}
      <a.mesh
        position={[0, 0, 0.01]}
        rotation={headSpring.rotation}
        scale={[isHeadFlipped ? -1 : 1, 1, 1]}
      >
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={currentHeadTexture} transparent={true} />
      </a.mesh>

      {/* Body with breathing animation */}
      <mesh ref={bodyRef} position={[0, 0, 0]}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={bodyTexture} transparent={true} />
      </mesh>

      {/* Right arm with animated rotation and idle up/down movement */}
      <a.mesh ref={armRef} position={[0, 0, -0.01]} rotation={armSpring.rotation}>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial map={armTexture} transparent={true} />
      </a.mesh>
    </a.group>
  );
};

export default MovingCharacter;
