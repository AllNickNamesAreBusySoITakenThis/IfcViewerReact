import { Viewer, WebIFCLoaderPlugin } from "@xeokit/xeokit-sdk";
import { useEffect, useRef, useState } from "react";
import * as WebIFC from 'web-ifc';
import { getIfcFileUrl } from "../services/serviceTools/tools";

const ifcAPI = new WebIFC.IfcAPI();

// class IfcDataSource {
//     constructor() {
//     }

//     // Gets the contents of the given IFC file in an arraybuffer
//     getIFC(src, ok, error) {
//         console.log("MyDataSource#getIFC(" + IFCSrc + ", ... )");
//         utils.loadArraybuffer(src,
//             (arraybuffer) => {
//                 ok(arraybuffer);
//             },
//             function (errMsg) {
//                 error(errMsg);
//             });
//     }
// }

interface IComponentProps {
    fileId: string;
}

export const XeokitViewer = ({ fileId }: IComponentProps) => {

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const viewerRef = useRef<Viewer | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        (async function init() {
            if (!canvasRef.current) return;

            if (ifcAPI.wasmModule === undefined) {
                ifcAPI.SetWasmPath("/wasm/v.0.70/", true);
                await ifcAPI.Init();
            }

            // Initialize xeokit viewer
            const viewer = new Viewer({
                canvasElement: canvasRef.current,
                transparent: true,
            });

            viewerRef.current = viewer;

            // Configure camera with better default position
            viewer.camera.eye = [-10, -10, 10];
            viewer.camera.look = [0, 0, 0];
            viewer.camera.up = [0, 0, 1];

            const webIFCLoader = new WebIFCLoaderPlugin(viewer, {
                WebIFC,
                IfcAPI: ifcAPI,

            });

            const model = webIFCLoader.load({
                src: getIfcFileUrl(fileId),
            });

        })();

        return () => {
            if (viewerRef.current) {
                viewerRef.current.destroy();
                viewerRef.current = null;
            }
        };
    }, []);

    return (
        <div
            className="model-viewer"
            style={{ position: "relative", width: "100%", height: "100%" }}
        >
            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner">Loading model...</div>
                </div>
            )}
            <canvas
                ref={canvasRef}
                style={{
                    width: "100%",
                    height: "100%",
                    display: "block",
                }}
            />
        </div>
    );
}