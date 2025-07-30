import React, { useRef, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Grid } from '@react-three/drei';
import * as THREE from 'three';
import { IFCModel } from '../types/ifc.types';
import './IFCModelViewer.css';
import { WebIfcThreeModel } from './WebIfcThreeModel';

interface IFCModelViewerProps {
    model: IFCModel | null;
}

interface IFCMeshProps {
    model: IFCModel;
}

const IFCMesh: React.FC<IFCMeshProps> = ({ model }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    const geometry = useMemo(() => {
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(model.geometry.vertices, 3));
        geo.setIndex(new THREE.BufferAttribute(model.geometry.indices, 1));

        if (model.geometry.colors) {
            geo.setAttribute('color', new THREE.BufferAttribute(model.geometry.colors, 3));
        }

        if (model.geometry.normals) {
            geo.setAttribute('normal', new THREE.BufferAttribute(model.geometry.normals, 3));
        } else {
            geo.computeVertexNormals();
        }

        return geo;
    }, [model]);

    const material = useMemo(() => {
        return new THREE.MeshLambertMaterial({
            vertexColors: model.geometry.colors ? true : false,
            color: model.geometry.colors ? undefined : 0x888888,
            side: THREE.DoubleSide,
        });
    }, [model.geometry.colors]);

    return (
        <mesh ref={meshRef} geometry={geometry} material={material}>
        </mesh>
    );
};

const CameraController: React.FC<{ boundingBox: IFCModel['boundingBox'] }> = ({ boundingBox }) => {
    const center = useMemo(() => {
        return new THREE.Vector3(
            (boundingBox.min.x + boundingBox.max.x) / 2,
            (boundingBox.min.y + boundingBox.max.y) / 2,
            (boundingBox.min.z + boundingBox.max.z) / 2
        );
    }, [boundingBox]);

    const distance = useMemo(() => {
        const size = new THREE.Vector3(
            boundingBox.max.x - boundingBox.min.x,
            boundingBox.max.y - boundingBox.min.y,
            boundingBox.max.z - boundingBox.min.z
        );
        return size.length() * 1.5;
    }, [boundingBox]);

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[center.x + distance, center.y + distance, center.z + distance]}
                fov={50}
            />
            <OrbitControls
                target={center}
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
            />
        </>
    );
};

export const IFCModelViewer: React.FC<IFCModelViewerProps> = ({ model }) => {
    // if (!model) {
    //     return (
    //         <div className="ifc-viewer-placeholder">
    //             <p>Выберите IFC файл для отображения</p>
    //         </div>
    //     );
    // }

    return (
        <div className="ifc-viewer">
            <Canvas
                shadows
                camera={{ position: [10, 10, 10], fov: 50 }}
                style={{ background: '#f0f0f0' }}
            >
                {/* <CameraController boundingBox={model.boundingBox} /> */}

                {/* Освещение */}
                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[10, 10, 5]}
                    intensity={1}
                    castShadow
                    shadow-mapSize-width={1024}
                    shadow-mapSize-height={1024}
                />
                <pointLight position={[-10, -10, -10]} intensity={0.5} />

                {/* Сетка */}
                {/* <Grid
                    args={[100, 100]}
                    position={[0, model.boundingBox.min.y - 1, 0]}
                    cellColor="#666666"
                    sectionColor="#888888"
                /> */}

                {/* 3D модель */}
                <WebIfcThreeModel />
                {/* <IFCMesh model={model} /> */}
            </Canvas>
        </div>
    );
};
