/* eslint-disable react/no-unknown-property */
//import { useLoader } from "@react-three/fiber"

import { useEffect, useState } from "react";
import { IFCLoader } from "../services/IFCLoader"
import { Object3D, Object3DEventMap } from "three";
import { getIfcFileUrl } from "../services/serviceTools/tools";

interface IComponentProps {
    fileId: string
    onLoaded: (item: Object3D<Object3DEventMap>) => void;
    onError?: (error: any) => void;
}

export const FiberIfcModel = ({ fileId, onLoaded, onError }: IComponentProps) => {
    const [ifc, setIfc] = useState<Object3D<Object3DEventMap> | undefined>(undefined);

    useEffect(() => {
        (async function loadIfcFile() {
            const loader = new IFCLoader();
            loader.load(getIfcFileUrl(fileId), (loadedData) => {
                setIfc(loadedData);
                onLoaded(loadedData);
            }, (progressEvent) => {
                //console.log(progressEvent.total);
            }, (error) => {
                console.error(error);
                if (onError) {
                    onError(error);
                }
            })
        })();
    }, [fileId, onLoaded, onError]);

    if (!ifc) {
        return null;
    }

    return (
        <primitive object={ifc} />
    );
}