import React, { useState, useRef } from "react";
import { useLoader, useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const InteractiveGramophone = ({
  position,
  name,
  geometrySize = [2, 2],
  onClick,
}) => {
  const [hovered, setHovered] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const speakerMeshRef = useRef();
  const baseMeshRef = useRef();
  const speakerTexturePath = "/props/gramophone_speaker.png";
  const baseTexturePath = "/props/gramophone_base.png"; 


  // Load textures for base and speaker
  const baseTexture = useLoader(THREE.TextureLoader, baseTexturePath);
  const speakerTexture = useLoader(THREE.TextureLoader, speakerTexturePath);

  // Make the speaker move when music plays
  useFrame(() => {
    if (speakerMeshRef.current) {
      if (isActive) {
        const scale = 1 + 0.05 * Math.sin(Date.now() * 0.005);
        speakerMeshRef.current.scale.set(scale, scale, scale);
      } else {
        speakerMeshRef.current.scale.set(1, 1, 1);
      }
    }
  });

  const handleClick = () => {
    setIsActive(!isActive);
    if (onClick) onClick();
  };

  return (
    <group position={position}>
      <mesh
        ref={baseMeshRef}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={handleClick}
      >
        <planeGeometry args={geometrySize} />
        <meshStandardMaterial map={baseTexture} transparent />
      </mesh>

      <mesh ref={speakerMeshRef} position={[0, 0, 0.01]}>
        <planeGeometry args={geometrySize} />
        <meshStandardMaterial map={speakerTexture} transparent />
      </mesh>

      {/* Hover Tooltip */}
      {hovered && (
        <Html position={[0, 1.2, 0]} center>
          <div
            style={{
              background: "rgba(0, 0, 0, 0.7)",
              padding: "5px 10px",
              borderRadius: "5px",
              color: "white",
              fontSize: "12px",
              whiteSpace: "nowrap",
            }}
          >
            {isActive ? "Stop Music" : "Play Music"}
          </div>
        </Html>
      )}
    </group>
  );
};

export default InteractiveGramophone;
