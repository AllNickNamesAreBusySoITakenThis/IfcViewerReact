import * as WebIFC from 'web-ifc';
import { IFCModel, IFCGeometry } from '../types/ifc.types';

export class IFCService {
    private ifcApi: WebIFC.IfcAPI | null = null;
    private modelId: number | null = null;
    private isInitialized: boolean = false;

    async initialize(): Promise<void> {
        try {
            if (this.isInitialized && this.ifcApi) {
                return; // Уже инициализировано
            }
            console.log('Initializing WebIFC...');
            this.ifcApi = new WebIFC.IfcAPI();
            this.ifcApi.SetWasmPath("/", true);
            await this.ifcApi.Init();
            this.isInitialized = true;

            console.log('WebIFC successfully initialized');
        } catch (error) {
            console.error('Failed to initialize WebIFC:', error);
            this.ifcApi = null;
            this.isInitialized = false;
            throw new Error(`Failed to initialize IFC processor: ${error}`);
        }
    }

    private ensureInitialized(): void {
        if (!this.isInitialized || !this.ifcApi) {
            throw new Error('IFC service not initialized. Call initialize() first.');
        }
    }

    async loadIFCFromFile(file: File, onProgress?: (progress: number) => void): Promise<IFCModel> {
        this.ensureInitialized();

        try {
            // Читаем файл как ArrayBuffer
            const arrayBuffer = await this.readFileAsArrayBuffer(file, onProgress);
            const fileData = new Uint8Array(arrayBuffer);

            if (onProgress) {
                onProgress(60); // 60% после чтения файла
            }

            // Парсим IFC файл
            this.modelId = this.ifcApi!.OpenModel(fileData);

            if (onProgress) {
                onProgress(80); // 80% после парсинга
            }

            // Получаем геометрию
            const geometry = await this.extractGeometry();

            if (onProgress) {
                onProgress(100); // 100% готово
            }

            return {
                geometry,
                materials: this.extractMaterials(),
                boundingBox: this.calculateBoundingBox(geometry),
            };

        } catch (error) {
            console.error('Error loading IFC file:', error);
            throw error;
        }
    }

    private readFileAsArrayBuffer(file: File, onProgress?: (progress: number) => void): Promise<ArrayBuffer> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.onload = () => {
                if (reader.result instanceof ArrayBuffer) {
                    resolve(reader.result);
                } else {
                    reject(new Error('Failed to read file as ArrayBuffer'));
                }
            };

            reader.onerror = () => {
                reject(new Error('Error reading file'));
            };

            reader.onprogress = (event) => {
                if (event.lengthComputable && onProgress) {
                    const progress = (event.loaded / event.total) * 50; // 50% для чтения файла
                    onProgress(progress);
                }
            };

            reader.readAsArrayBuffer(file);
        });
    }

    private async extractGeometry(): Promise<IFCGeometry> {
        this.ensureInitialized();

        if (this.modelId === null) {
            throw new Error('No model loaded');
        }

        try {
            const ifcElements = this.ifcApi!.GetLineIDsWithType(this.modelId, WebIFC.IFCBUILDINGELEMENT);
            const vertices: number[] = [];
            const indices: number[] = [];
            const colors: number[] = [];

            let vertexOffset = 0;

            for (let i = 0; i < ifcElements.size(); i++) {
                const elementID = ifcElements.get(i);

                try {
                    const geometryData = this.ifcApi!.GetGeometry(this.modelId, elementID);

                    if (geometryData) {
                        const verts = this.ifcApi!.GetVertexArray(geometryData.GetVertexData(), geometryData.GetVertexDataSize());
                        const inds = this.ifcApi!.GetIndexArray(geometryData.GetIndexData(), geometryData.GetIndexDataSize());

                        // Добавляем вершины
                        for (let j = 0; j < verts.length; j++) {
                            vertices.push(verts[j]);
                        }

                        // Добавляем индексы с смещением
                        for (let j = 0; j < inds.length; j++) {
                            indices.push(inds[j] + vertexOffset);
                        }

                        // Добавляем цвета (пока что случайные)
                        const color = this.generateRandomColor();
                        for (let j = 0; j < verts.length / 3; j++) {
                            colors.push(color.r, color.g, color.b);
                        }

                        vertexOffset += verts.length / 3;
                    }
                } catch (elementError) {
                    console.warn(`Failed to process element ${elementID}:`, elementError);
                    continue;
                }
            }

            return {
                vertices: new Float32Array(vertices),
                indices: new Uint32Array(indices),
                colors: new Float32Array(colors),
            };

        } catch (error) {
            console.error('Error extracting geometry:', error);
            throw new Error('Failed to extract geometry from IFC file');
        }
    }

    private extractMaterials() {
        // Простая реализация материалов
        return [
            {
                id: 1,
                name: 'Default Material',
                color: { r: 0.8, g: 0.8, b: 0.8, a: 1.0 }
            }
        ];
    }

    private calculateBoundingBox(geometry: IFCGeometry) {
        const vertices = geometry.vertices;
        let minX = Infinity, minY = Infinity, minZ = Infinity;
        let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;

        for (let i = 0; i < vertices.length; i += 3) {
            const x = vertices[i];
            const y = vertices[i + 1];
            const z = vertices[i + 2];

            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
            if (z < minZ) minZ = z;
            if (z > maxZ) maxZ = z;
        }

        return {
            min: { x: minX, y: minY, z: minZ },
            max: { x: maxX, y: maxY, z: maxZ }
        };
    }

    private generateRandomColor() {
        return {
            r: Math.random(),
            g: Math.random(),
            b: Math.random()
        };
    }

    dispose(): void {
        if (this.modelId !== null && this.ifcApi) {
            this.ifcApi.CloseModel(this.modelId);
            this.modelId = null;
        }
        this.isInitialized = false;
        this.ifcApi = null;
    }
}