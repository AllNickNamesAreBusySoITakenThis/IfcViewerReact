export const getApiUrl = (path: string): string => {
    const baseUrl = process.env.API_BASE_URL || 'https://localhost:7247/';
    return `${baseUrl}${path}`;
}

export const getIfcFileUrl = (fileId: string): string => {
    return getApiUrl(`IfcManage/getIfcFile/${fileId}`);
}