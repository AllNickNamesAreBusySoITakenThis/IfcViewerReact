import React, { useCallback, useState } from 'react';
import { LocalIFCFile, LoadingState } from '../types/ifc.types';
import './FileUploader.css';

interface FileUploaderProps {
    onFileSelect: (file: LocalIFCFile) => void;
    selectedFile: LocalIFCFile | null;
    loadingState: LoadingState;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    onFileSelect,
    selectedFile,
    loadingState
}) => {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    }, []);

    const handleFiles = useCallback((files: FileList) => {
        const file = files[0];

        // Проверяем расширение файла
        if (!file.name.toLowerCase().endsWith('.ifc')) {
            alert('Пожалуйста, выберите файл с расширением .ifc');
            return;
        }

        // Проверяем размер файла (максимум 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (file.size > maxSize) {
            alert('Размер файла не должен превышать 100MB');
            return;
        }

        const localFile: LocalIFCFile = {
            file,
            id: `${file.name}-${Date.now()}`,
            name: file.name,
            size: file.size,
            lastModified: new Date(file.lastModified)
        };

        onFileSelect(localFile);
    }, [onFileSelect]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files);
        }
    }, [handleFiles]);

    const formatFileSize = (bytes: number): string => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="file-uploader">
            <div className="file-uploader-header">
                <h3>Загрузка IFC файла</h3>
            </div>

            {loadingState.isLoading && (
                <div className="loading-overlay">
                    <div className="loading-progress">
                        <div className="spinner"></div>
                        <p>{loadingState.currentOperation}</p>
                        <span>{Math.round(loadingState.progress)}%</span>
                    </div>
                </div>
            )}

            <div className="file-uploader-content">
                {!selectedFile ? (
                    <div
                        className={`file-drop-zone ${dragActive ? 'drag-active' : ''}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <div className="drop-zone-content">
                            <div className="drop-zone-icon">📁</div>
                            <p className="drop-zone-text">
                                Перетащите IFC файл сюда или{' '}
                                <label htmlFor="file-input" className="file-input-label">
                                    выберите файл
                                </label>
                            </p>
                            <input
                                id="file-input"
                                type="file"
                                accept=".ifc"
                                onChange={handleChange}
                                className="file-input"
                            />
                            <div className="drop-zone-info">
                                <p>Поддерживаемые форматы: .ifc</p>
                                <p>Максимальный размер: 100MB</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="selected-file">
                        <div className="file-info">
                            <div className="file-icon">📄</div>
                            <div className="file-details">
                                <div className="file-name">{selectedFile.name}</div>
                                <div className="file-meta">
                                    <span className="file-size">{formatFileSize(selectedFile.size)}</span>
                                    <span className="file-date">{formatDate(selectedFile.lastModified)}</span>
                                </div>
                            </div>
                            <button
                                className="remove-file-button"
                                onClick={() => onFileSelect(null as any)}
                                disabled={loadingState.isLoading}
                            >
                                ✕
                            </button>
                        </div>

                        <div className="file-actions">
                            <label htmlFor="file-input-replace" className="replace-file-button">
                                Заменить файл
                            </label>
                            <input
                                id="file-input-replace"
                                type="file"
                                accept=".ifc"
                                onChange={handleChange}
                                className="file-input"
                                disabled={loadingState.isLoading}
                            />
                        </div>
                    </div>
                )}

                {loadingState.error && (
                    <div className="error-message">
                        <h4>Ошибка загрузки</h4>
                        <p>{loadingState.error}</p>
                    </div>
                )}
            </div>
        </div>
    );
};
