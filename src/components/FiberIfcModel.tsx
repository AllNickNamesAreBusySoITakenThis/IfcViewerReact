/* eslint-disable react/no-unknown-property */
//import { useLoader } from "@react-three/fiber"

import { useEffect, useState } from "react";
import { IFCLoader } from "../services/IFCLoader"
import { Object3D, Object3DEventMap } from "three";

interface IComponentProps {
    path: string
}

export const FiberIfcModel = ({ path }: IComponentProps) => {
    const [ifc, setIfc] = useState<Object3D<Object3DEventMap> | undefined>(undefined);

    useEffect(() => {
        (async function loadIfcFile() {
            const loader = new IFCLoader();
            loader.load(path, (loadedData) => {
                setIfc(loadedData);
            }, (progressEvent) => {
                //console.log(progressEvent.total);
            }, (error) => {
                //console.error(error);
            })
        })();
    }, [path]);

    if (!ifc) {
        return null;
    }

    return (
        <primitive object={ifc} />
    );
}