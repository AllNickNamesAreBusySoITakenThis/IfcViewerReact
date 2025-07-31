export interface LocalIFCFile {
    file: File;
    id: string;
    name: string;
    size: number;
    lastModified: Date;
}

export interface IFCGeometry {
    vertices: Float32Array;
    indices: Uint32Array;
    colors?: Float32Array;
    normals?: Float32Array;
}

export interface IFCModel {
    geometry: IFCGeometry;
    materials: Material[];
    boundingBox: {
        min: { x: number; y: number; z: number };
        max: { x: number; y: number; z: number };
    };
}

export interface Material {
    id: number;
    name: string;
    color: {
        r: number;
        g: number;
        b: number;
        a: number;
    };
}

export interface LoadingState {
    isLoading: boolean;
    progress: number;
    error: string | null;
    currentOperation: string;
}
