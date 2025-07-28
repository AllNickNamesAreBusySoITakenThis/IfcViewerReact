import React, { useState, useEffect, useCallback } from 'react';
import { IFCModelViewer } from './IFCModelViewer';
import { FileUploader } from './FileUploader';
import { IFCService } from '../services/ifcService';
import { LocalIFCFile, IFCModel, LoadingState } from '../types/ifc.types';
import './IFCApp.css';

export const IFCApp: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<LocalIFCFile | null>(null);
    const [currentModel, setCurrentModel] = useState<IFCModel | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>({
        isLoading: false,
        progress: 0,
        error: null,
        currentOperation: ''
    });
    const [ifcService] = useState(() => new IFCService());

    useEffect(() => {
        const initializeIFC = async () => {
            try {
                await ifcService.initialize();
            } catch (error) {
                setLoadingState(prev => ({
                    ...prev,
                    error: error instanceof Error ? error.message : 'Ошибка инициализации IFC процессора'
                }));
            }
        };

        initializeIFC();

        return () => {
            ifcService.dispose();
        };
    }, [ifcService]);

    const handleFileSelect = useCallback(async (file: LocalIFCFile | null) => {
        if (!file) {
            setSelectedFile(null);
            setCurrentModel(null);
            setLoadingState({
                isLoading: false,
                progress: 0,
                error: null,
                currentOperation: ''
            });
            return;
        }

        if (selectedFile?.id === file.id) {
            return; // Файл уже выбран
        }

        setSelectedFile(file);
        setCurrentModel(null);
        setLoadingState({
            isLoading: true,
            progress: 0,
            error: null,
            currentOperation: 'Подготовка к загрузке...'
        });

        try {
            const model = await ifcService.loadIFCFromFile(file.file, (progress) => {
                let operation = 'Чтение файла...';
                if (progress > 50) {
                    operation = 'Обработка геометрии...';
                }
                if (progress > 80) {
                    operation = 'Финализация модели...';
                }

                setLoadingState(prev => ({
                    ...prev,
                    progress,
                    currentOperation: operation
                }));
            });

            setCurrentModel(model);
            setLoadingState(prev => ({
                ...prev,
                isLoading: false,
                progress: 100,
                currentOperation: 'Готово!'
            }));

        } catch (error) {
            console.error('Error loading IFC model:', error);
            setLoadingState(prev => ({
                ...prev,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Ошибка загрузки модели'
            }));
        }
    }, [selectedFile, ifcService]);

    const handleRetry = useCallback(() => {
        if (selectedFile) {
            handleFileSelect(selectedFile);
        }
    }, [selectedFile, handleFileSelect]); return (
        <div className="ifc-app">
            <header className="ifc-app-header">
                <h1>IFC Viewer</h1>
                <p>Просмотрщик IFC файлов с использованием Three.js и WebIFC</p>
            </header>

            <main className="ifc-app-main">
                <aside className="ifc-app-sidebar">
                    <FileUploader
                        onFileSelect={handleFileSelect}
                        selectedFile={selectedFile}
                        loadingState={loadingState}
                    />
                </aside>                <section className="ifc-app-viewer">
                    {loadingState.error ? (
                        <div className="error-state">
                            <h3>Ошибка загрузки</h3>
                            <p>{loadingState.error}</p>
                            <button onClick={handleRetry} className="retry-button">
                                Повторить попытку
                            </button>
                        </div>
                    ) : (
                        <IFCModelViewer model={currentModel} />
                    )}

                    {selectedFile && currentModel && (
                        <div className="model-info">
                            <h4>Информация о модели</h4>
                            <div className="model-stats">
                                <div className="stat">
                                    <span className="stat-label">Файл:</span>
                                    <span className="stat-value">{selectedFile.name}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Вершины:</span>
                                    <span className="stat-value">{currentModel.geometry.vertices.length / 3}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Треугольники:</span>
                                    <span className="stat-value">{currentModel.geometry.indices.length / 3}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Размеры:</span>
                                    <span className="stat-value">
                                        {Math.round(currentModel.boundingBox.max.x - currentModel.boundingBox.min.x)} ×{' '}
                                        {Math.round(currentModel.boundingBox.max.y - currentModel.boundingBox.min.y)} ×{' '}
                                        {Math.round(currentModel.boundingBox.max.z - currentModel.boundingBox.min.z)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};
