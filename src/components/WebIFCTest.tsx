import React, { useEffect, useState } from 'react';
import * as WebIFC from 'web-ifc';

export const WebIFCTest: React.FC = () => {
    const [status, setStatus] = useState<string>('Не инициализирован');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const testWebIFC = async () => {
            try {
                setStatus('Инициализация...');

                const api = new WebIFC.IfcAPI();
                await api.Init();

                setStatus('WebIFC успешно инициализирован!');
                console.log('WebIFC initialized successfully');
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
                setError(errorMessage);
                setStatus('Ошибка инициализации');
                console.error('WebIFC initialization failed:', err);
            }
        };

        testWebIFC();
    }, []);

    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
            <h3>Тест WebIFC</h3>
            <p><strong>Статус:</strong> {status}</p>
            {error && (
                <div style={{ color: 'red' }}>
                    <p><strong>Ошибка:</strong> {error}</p>
                </div>
            )}
        </div>
    );
};
