import * as WebIFC from 'web-ifc';
import {
    FileLoader,
    Loader,
    Object3D,
    Mesh,
    MeshPhongMaterial,
    DoubleSide,
    Matrix4,
    BufferGeometry,
    InterleavedBuffer,
    InterleavedBufferAttribute,
    BufferAttribute,
    LoadingManager,
    Color,
    Object3DEventMap,
} from 'three';

const ifcAPI = new WebIFC.IfcAPI();

class IFCLoader extends Loader {

    constructor(manager?: LoadingManager) {
        super(manager);
    }

    load(url: string,
        onLoad?: (data: Object3D<Object3DEventMap>) => void,
        onProgress?: (event: ProgressEvent) => void,
        onError?: (err: unknown) => void,) {

        const scope = this;

        const loader = new FileLoader(scope.manager);
        loader.setPath(scope.path);
        loader.setResponseType('arraybuffer');
        loader.setRequestHeader(scope.requestHeader);
        loader.setWithCredentials(scope.withCredentials);
        loader.load(
            url,
            async function (buffer) {

                try {
                    if (typeof buffer == 'string') {
                        throw new Error('IFC files must be given as a buffer!');
                    }
                    if (onLoad)
                        onLoad(await scope.parse(buffer));

                } catch (e) {

                    if (onError) {

                        onError(e);

                    } else {

                        console.error(e);

                    }

                    scope.manager.itemError(url);

                }

            },
            onProgress,
            onError
        );

    }

    async parse(buffer: ArrayBuffer) {

        if (ifcAPI.wasmModule === undefined) {
            ifcAPI.SetWasmPath("/wasm/v.0.70/", true);
            await ifcAPI.Init();

        }

        const data = new Uint8Array(buffer);
        const modelID = ifcAPI.OpenModel(data, {
            COORDINATE_TO_ORIGIN: true,
            CIRCLE_SEGMENTS: 64,
            MEMORY_LIMIT: 1024,
        });
        return loadAllGeometry(modelID);

        function loadAllGeometry(modelID: number) {

            const flatMeshes = getFlatMeshes(modelID);
            const mainObject = new Object3D();
            for (let i = 0; i < flatMeshes.size(); i++) {

                const placedGeometries = flatMeshes.get(i).geometries;
                for (let j = 0; j < placedGeometries.size(); j++)
                    mainObject.add(getPlacedGeometry(modelID, placedGeometries.get(j)));

            }

            return mainObject;

        }

        function getFlatMeshes(modelID: number) {

            const flatMeshes = ifcAPI.LoadAllGeometry(modelID);
            return flatMeshes;

        }

        function getPlacedGeometry(modelID: number, placedGeometry: WebIFC.PlacedGeometry) {

            const geometry = getBufferGeometry(modelID, placedGeometry);
            const material = getMeshMaterial(placedGeometry.color);
            const mesh = new Mesh(geometry, material);
            mesh.matrix = getMeshMatrix(placedGeometry.flatTransformation);
            mesh.matrixAutoUpdate = false;
            return mesh;

        }

        function getBufferGeometry(modelID: number, placedGeometry: WebIFC.PlacedGeometry) {

            const geometry = ifcAPI.GetGeometry(
                modelID,
                placedGeometry.geometryExpressID
            );
            const verts = ifcAPI.GetVertexArray(
                geometry.GetVertexData(),
                geometry.GetVertexDataSize()
            );
            const indices = ifcAPI.GetIndexArray(
                geometry.GetIndexData(),
                geometry.GetIndexDataSize()
            );
            const bufferGeometry = ifcGeometryToBuffer(verts, indices);
            return bufferGeometry;

        }

        function getMeshMaterial(color: WebIFC.Color) {

            const col = new Color(color.x, color.y, color.z);
            const material = new MeshPhongMaterial({ color: col, side: DoubleSide });
            material.transparent = color.w !== 1;
            if (material.transparent) material.opacity = color.w;
            return material;

        }

        function getMeshMatrix(matrix: number[]) {

            const mat = new Matrix4();
            mat.fromArray(matrix);
            // mat.elements[15 - 3] *= 0.001;
            // mat.elements[15 - 2] *= 0.001;
            // mat.elements[15 - 1] *= 0.001;
            return mat;

        }

        function ifcGeometryToBuffer(vertexData: any, indexData: any) {

            const geometry = new BufferGeometry();
            const buffer32 = new InterleavedBuffer(vertexData, 6);
            geometry.setAttribute(
                'position',
                new InterleavedBufferAttribute(buffer32, 3, 0)
            );
            geometry.setAttribute(
                'normal',
                new InterleavedBufferAttribute(buffer32, 3, 3)
            );
            geometry.setIndex(new BufferAttribute(indexData, 1));
            return geometry;

        }

    }

    setWasmPath(path: string) {
        ifcAPI.SetWasmPath(path);
    }
};

export { IFCLoader };