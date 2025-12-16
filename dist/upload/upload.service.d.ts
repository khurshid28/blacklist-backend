export declare class UploadService {
    getMulterConfig(folder: 'videos' | 'images'): {
        storage: import("multer").StorageEngine;
        fileFilter: (req: any, file: any, callback: any) => void;
        limits: {
            fileSize: number;
        };
    };
    getFileUrl(filename: string, folder: 'videos' | 'images'): string;
}
