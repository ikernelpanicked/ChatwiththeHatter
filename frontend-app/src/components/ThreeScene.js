import React from 'react';
import { Canvas } from '@react-three/fiber';
import JumpingPlane from './JumpingPlane';

const ThreeScene = ({ jumpTrigger }) => {
  return (
    <Canvas style={{ width: '100%', height: '100%' }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <JumpingPlane trigger={jumpTrigger} />
    </Canvas>
  );
};

export default ThreeScene;
