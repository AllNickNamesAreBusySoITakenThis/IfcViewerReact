export const getApiUrl = (path: string): string => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://localhost:7247/';
    return `${baseUrl}${path}`;
}

export const getIfcFileUrl = (fileId: string): string => {
    return getApiUrl(`IfcManage/getIfcFile/${fileId}`);
}