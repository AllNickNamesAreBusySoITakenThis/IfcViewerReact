import { CameraControls, GizmoHelper, GizmoViewcube } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { useRef, useState, useCallback } from "react";
import { FiberIfcModel } from "./FiberIfcModel";
import { Object3D, Object3DEventMap } from "three";
import './FiberCanvas.css';

export const FiberCanvas = () => {
    const cameraControlRef = useRef<CameraControls>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const onIFCLoaded = useCallback((item: Object3D<Object3DEventMap>) => {
        if (cameraControlRef.current) {
            cameraControlRef.current.fitToBox(item, true, { paddingTop: 5, paddingBottom: 5, paddingLeft: 5, paddingRight: 5 });
        }
        setIsLoading(false);
        setError(null);
    }, []);

    const onIFCError = useCallback((error: any) => {
        setIsLoading(false);
        setError('Error loading IFC file: ' + (error?.message || 'Unknown error'));
    }, []);
    return (
        <div className="canvas-container">
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                    <span className="loading-text">Loading IFC model...</span>
                </div>
            )}
            {error && (
                <div className="loading-overlay">
                    <span className="error-text">{error}</span>
                </div>
            )}
            <Canvas
                flat={true}
                linear={true}
            >
                <ambientLight intensity={1} />
                {!isLoading && !error &&
                    <GizmoHelper alignment="top-right" margin={[50, 120]}>
                        <GizmoViewcube hoverColor="#D9D9D9" />
                    </GizmoHelper>
                }
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
                <FiberIfcModel fileId="4" onLoaded={onIFCLoaded} onError={onIFCError} />
                {/* <FiberIfcModel path="/Sample IFC.ifc" /> */}
            </Canvas>
        </div>
    )
}