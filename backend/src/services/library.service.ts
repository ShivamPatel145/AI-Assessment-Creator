import { LibraryFile, ILibraryFile } from '../models/LibraryFile';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────
export interface AddFileData {
  name: string;
  type: string;
  folder?: string;
}

// ── Service Functions ─────────────────────────────────────────────────

export const getFilesService = async (userId: string): Promise<ILibraryFile[]> => {
  const files = await LibraryFile.find({ user: userId }).sort({ createdAt: -1 });
  logger.info({ userId, count: files.length }, '[LIBRARY] Fetched files');
  return files;
};

export const addFileService = async (userId: string, data: AddFileData): Promise<ILibraryFile> => {
  if (!data.name || !data.type) {
    throw new AppError('File name and type are required', 400);
  }

  const file = await LibraryFile.create({
    user: userId,
    name: data.name,
    type: data.type,
    folder: data.folder || 'Uncategorized',
  });
  logger.info({ userId, fileId: file._id }, '[LIBRARY] Added file');
  return file;
};

export const deleteFileService = async (fileId: string, userId: string): Promise<ILibraryFile> => {
  const file = await LibraryFile.findOneAndDelete({ _id: fileId, user: userId });
  if (!file) throw new AppError('File not found or unauthorized', 404);
  logger.info({ userId, fileId }, '[LIBRARY] Deleted file');
  return file;
};

export const getFilesByFolderService = async (userId: string, folder: string): Promise<ILibraryFile[]> => {
  return LibraryFile.find({ user: userId, folder }).sort({ createdAt: -1 });
};
