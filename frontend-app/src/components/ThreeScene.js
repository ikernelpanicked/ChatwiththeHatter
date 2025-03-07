import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import {
  OrbitControls,
  PerspectiveCamera,
  CameraShake,
  Environment,
  Html,
} from '@react-three/drei';
import MovingCharacter from './MovingCharacter';
import InteractiveObject from './InteractiveObject';
import SoundCloudPlayer from './SoundCloudPlayer';
import { EffectComposer, HueSaturation, Vignette } from '@react-three/postprocessing';

const ThreeScene = ({ jumpTrigger, onObjectClick, onMusicClick }) => {
  const [showSoundCloud, setShowSoundCloud] = useState(false);
  const [cubeHovered, setCubeHovered] = useState(false);

  const handleCubeClick = (e) => {
    onObjectClick('User started playing music.');
    e.stopPropagation();
    setShowSoundCloud(true);
  };

  const handleCloseSoundCloud = () => {
    setShowSoundCloud(false);
  };

  return (
    <Canvas style={{ width: '90%', height: '80%' }}>
      {/* Environment */}
      <Environment preset="forest" background />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={30} />

      {/* Controls */}
      <OrbitControls enablePan enableZoom enableRotate />

      {/* Helpers */}
      <gridHelper args={[100, 100, 'white', 'gray']} />
      <axesHelper args={[5]} />
      <CameraShake maxYaw={0.05} maxPitch={0.05} maxRoll={0.05} intensity={1} decay={0} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* White Cube Table */}
      <mesh position={[0, -3, 0]} rotation={[0, Math.PI / 7, 0]}>
        <boxGeometry args={[14, 4, 4]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Moving Character */}
      <group position={[-1, 0, -2]}>
        <MovingCharacter trigger={jumpTrigger} />
      </group>

      {/* Interactive Object */}
      <InteractiveObject
        position={[1, 0, 1]}
        name="teapot"
        onClick={() => onObjectClick && onObjectClick('User touched the teapot.')}
      />

      {/* Trigger Cube for SoundCloudPlayer */}
      <mesh
        position={[-4, 0, 0]}
        onClick={handleCubeClick}
        onPointerOver={() => setCubeHovered(true)}
        onPointerOut={() => setCubeHovered(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="blue" />
        {/* White outline and tooltip when hovered */}
        {cubeHovered && (
          <>
            <mesh scale={[1.1, 1.1, 1.1]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial
                color="white"
                wireframe
                transparent
                opacity={0.8}
              />
            </mesh>
            <Html
              position={[0, 1.2, 0]}
              style={{
                color: 'white',
                fontSize: '14px',
                fontFamily: 'sans-serif',
                pointerEvents: 'none',
                padding: '2px 4px',
                background: 'rgba(0,0,0,0.6)',
                borderRadius: '4px',
              }}
            >
              play music
            </Html>
          </>
        )}
      </mesh>

      {/* Render the SoundCloudPlayer above the cube */}
      {showSoundCloud && (
        <SoundCloudPlayer
          autoplay={true}
          onClose={handleCloseSoundCloud}
          initialPosition={[-4, 2, 0]}
        />
      )}

      {/* Postprocessing Effects */}
      <EffectComposer>
        <HueSaturation saturation={-1} />
        <Vignette offset={0.3} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
};

export default ThreeScene;
