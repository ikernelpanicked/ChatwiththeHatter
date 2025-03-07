import React, { useState, useEffect } from 'react';
import { a, useSpring } from '@react-spring/three';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

const InteractiveObject = ({ position, onClick, color = 'red' }) => {
    const texture = useLoader(THREE.TextureLoader, '/hatter/teapot.png');
    
  return (
    <mesh position={position} onClick={onClick}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <planeGeometry args={[2, 2]} />
      <meshStandardMaterial map={texture} transparent={true} />
    </mesh>
  );
};

export default InteractiveObject;
