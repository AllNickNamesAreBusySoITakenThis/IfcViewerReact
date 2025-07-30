import { Fragment, useEffect, useState } from "react";
import * as THREE from 'three';
import { IFCLoader } from "web-ifc-three";

export const WebIfcThreeModel = () => {
    const [model, setModel] = useState<THREE.Object3D | null>(null);

    useEffect(() => {
        const loader = new IFCLoader();
        loader.ifcManager.setWasmPath("/");

        loader.load(`./Standtmodell.ifc`, (ifcModel) => {
            setModel(ifcModel);
        },
            (xhr: ProgressEvent<EventTarget>) => {
                // eslint-disable-next-line no-console
                console.log(`Loading IFC model: ${(xhr.loaded / xhr.total * 100).toFixed(2)}% loaded`);
            },
            (error: ErrorEvent) => {
                // Optional: handle error
                console.error("Error loading IFC model:", error);
            });

        return () => {
            if (model) {
                // Очистка ресурсов при размонтировании компонента
                model.traverse((child) => {
                    if ((child as THREE.Mesh).isMesh) {
                        const mesh = child as THREE.Mesh;
                        if (mesh.geometry) mesh.geometry.dispose();
                        if (mesh.material) {
                            const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                            materials.forEach(material => material.dispose());
                        }
                    }
                });
            }
        };
    }, []);

    if (!model) return null;

    return (
        <Fragment>
            <mesh>
                <primitive object={model} />
            </mesh>
        </Fragment>
    )
};