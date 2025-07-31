import { CameraControls, GizmoHelper, GizmoViewcube } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState } from "react";
import { FiberIfcModel } from "./FiberIfcModel";

export const FiberCanvas = () => {
    const cameraControlRef = useRef(null);
    return (
        <div style={{ height: '100vh', width: '100vw' }}>
            <Canvas
                flat={true}
                linear={true}
            >
                <ambientLight intensity={1} />
                <GizmoHelper alignment="top-right" margin={[50, 120]}>
                    <GizmoViewcube hoverColor="#D9D9D9" />
                </GizmoHelper>
                <CameraControls
                    makeDefault={true}
                    dampingFactor={0}
                    ref={cameraControlRef}
                    dollyToCursor={true}
                    infinityDolly={true}
                    minDistance={0.1}
                    minZoom={1}
                    maxZoom={20}
                />
                {/* <FiberIfcModel path="/Standtmodell.ifc" /> */}
                {/* <FiberIfcModel path="/DGM_113533-114694km_IFC4.ifc" /> */}
                <FiberIfcModel path="/Modell georeferenziert.ifc" />
                {/* <FiberIfcModel path="/Sample IFC.ifc" /> */}
            </Canvas>
        </div>
    )
}