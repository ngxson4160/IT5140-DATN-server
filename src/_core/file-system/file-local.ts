import {
  createReadStream,
  createWriteStream,
  ensureDir,
  unlink,
  writeFile,
  rm,
  ensureDirSync,
} from 'fs-extra';
import { join, resolve } from 'path';
import { IFileService } from './file.interface';
import { CommonException } from '../middleware/filter/exception.filter';
import { MessageResponse } from '../constant/message-response.constant';

export class LocalFileService implements IFileService {
  RELATIVE_DIR = 'public';

  STORAGE_DIR = join(global.__rootDir, this.RELATIVE_DIR);

  constructor() {
    ensureDir(this.STORAGE_DIR);
  }

  async uploadFile(file: Express.Multer.File, path?: string) {
    const { buffer, originalname } = file;
    const filePath = path ? path : originalname;

    const lastIndex = filePath.lastIndexOf('/');
    const folderPath = filePath.substring(0, lastIndex);
    ensureDirSync(resolve(this.STORAGE_DIR, folderPath));

    const absolutePath = resolve(this.STORAGE_DIR, filePath);

    try {
      await writeFile(absolutePath, buffer);
      return {
        relativePath: filePath,
        absolutePath,
      };
    } catch (e) {
      console.log(e);
      throw new CommonException(MessageResponse.COMMON.LOCAL_UPLOAD_ERROR);
    }
  }

  async deleteFile(filePath: string) {
    if (!filePath) return;
    const path = resolve(this.STORAGE_DIR, filePath);
    await unlink(path);
  }

  async deleteFolder(path: string) {
    try {
      await rm(path, { recursive: true, force: true });
    } catch (e) {
      console.log(e);
      throw new CommonException(MessageResponse.COMMON.LOCAL_UPLOAD_ERROR);
    }
  }

  copy = (oldPath: string, newPath: string, cb = (error: Error) => {}) => {
    const readStream = createReadStream(oldPath);
    const writeStream = createWriteStream(newPath, {});

    readStream.on('error', cb);
    writeStream.on('error', cb);

    readStream.on('close', function () {
      unlink(oldPath, cb);
    });

    readStream.pipe(writeStream);
  };
}
