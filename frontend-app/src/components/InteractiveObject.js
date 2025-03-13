import React, { useState } from "react";
import { useLoader } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";

const InteractiveObject = ({ position, name, texturePath, geometrySize = [2, 2], onClick }) => {
  const [hovered, setHovered] = useState(false);

  const texture = useLoader(THREE.TextureLoader, texturePath);

  return (
    <group position={position}>
      <mesh
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        onClick={onClick}
      >
        <planeGeometry args={geometrySize} />
        <meshStandardMaterial map={texture} transparent />
      </mesh>

      {/* Hover Tooltip*/}
      {hovered && (
        <Html position={[0, 0.8, 0]} center>
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
            Click {name}
          </div>
        </Html>
      )}
    </group>
  );
};

export default InteractiveObject;
