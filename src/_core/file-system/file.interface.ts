type PathFile = {
  relativePath: string;
  absolutePath: string;
};

export interface IFileService {
  uploadFile(file: Express.Multer.File, path?: string): Promise<PathFile>;

  deleteFile(path: string): Promise<void>;

  deleteFolder(path: string): Promise<void>;

  copy(oldPath: string, newPath: string, cb: (...args: any[]) => any): void;
}
