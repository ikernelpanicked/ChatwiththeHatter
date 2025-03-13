import React, { useState } from "react";
import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  CameraShake,
  Environment,
} from "@react-three/drei";
import MovingCharacter from "./MovingCharacter";
import InteractiveObject from "./InteractiveObject";
import SoundCloudPlayer from "./SoundCloudPlayer";
import InteractiveGramophone from "./InteractiveGramophone";
import { EffectComposer, HueSaturation, Vignette } from "@react-three/postprocessing";

const ThreeScene = ({ jumpTrigger, onInteractiveObjectClick }) => {
  const [showSoundCloud, setShowSoundCloud] = useState(false);

  const handleSoundCloudOpen = (e) => {
    setShowSoundCloud(true);
  };

  const handleCloseSoundCloud = () => {
    setShowSoundCloud(false);
  };

  const handleGramophoneInteraction = () =>{
    setShowSoundCloud(!showSoundCloud); 
    showSoundCloud ? onInteractiveObjectClick('User stopped on the Gramophone.') : onInteractiveObjectClick('User started the Gramophone.'); 
  };

  return (
    <Canvas style={{ width: "100%", height: "100%" }}>
      {/* Environment */}
      <Environment preset="forest" background />

      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={40} />
      <CameraShake maxYaw={0.05} maxPitch={0.05} maxRoll={0.05} intensity={1} decay={0} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* White Cube Table */}
      <mesh position={[0, -2.9, 4]} rotation={[Math.PI / 29, 0, 0]}>
        <boxGeometry args={[14, 4, 10]} />
        <meshStandardMaterial color="white" />
      </mesh>

      {/* Moving Character */}
      <group position={[0, 1, -2]}>
        <MovingCharacter trigger={jumpTrigger} />
      </group>

      <InteractiveObject
        position={[2, .25, 2]}
        name="Teapot"
        texturePath="/props/teapot.png"
        geometrySize={[2, 2]} // Default size
        onClick={() => onInteractiveObjectClick && onInteractiveObjectClick('User tapped the teapot.')}
        />

        <InteractiveGramophone
          position={[-2, 0.25, 2]}
          name="Gramophone"
          geometrySize={[2, 2]}
          onClick={() => handleGramophoneInteraction()}
        />

      {/* Render the SoundCloudPlayer above the cube */}
      {showSoundCloud && (
        <SoundCloudPlayer 
        autoplay={true}
        initialPosition={[4, -4, 0]}
        geometrySize={[0, 0]} 
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
