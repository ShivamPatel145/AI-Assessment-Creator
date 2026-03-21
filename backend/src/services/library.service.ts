import { LibraryFile, ILibraryFile } from '../models/LibraryFile';
import { LibraryFolder, ILibraryFolder } from '../models/LibraryFolder';
import { AppError } from '../utils/AppError';
import logger from '../utils/logger';

// ── Types ─────────────────────────────────────────────────────────────
export interface AddFileData {
  name: string;
  type: string;
  folder?: string;
  folderId?: string;
  fileUrl?: string;
  mimeType?: string;
  sizeBytes?: number;
  storageKey?: string;
}

export interface UpdateFileData {
  name?: string;
  type?: string;
  folder?: string;
}

export interface CreateFolderData {
  name: string;
  category: string;
}

// ── Service Functions ─────────────────────────────────────────────────

export const getFilesService = async (userId: string): Promise<ILibraryFile[]> => {
  const files = await LibraryFile.find({ user: userId }).sort({ createdAt: -1 });
  logger.info({ userId, count: files.length }, '[LIBRARY] Fetched files');
  return files;
};

export const getFoldersService = async (userId: string): Promise<ILibraryFolder[]> => {
  return LibraryFolder.find({ user: userId }).sort({ createdAt: -1 });
};

export const createFolderService = async (userId: string, data: CreateFolderData): Promise<ILibraryFolder> => {
  if (!data.name?.trim()) {
    throw new AppError('Folder name is required', 400);
  }

  const folder = await LibraryFolder.create({
    user: userId,
    name: data.name.trim(),
    category: data.category?.trim() || 'Reference',
  });

  logger.info({ userId, folderId: folder._id }, '[LIBRARY] Created folder');
  return folder;
};

export const getFolderByIdService = async (folderId: string, userId: string): Promise<ILibraryFolder> => {
  const folder = await LibraryFolder.findOne({ _id: folderId, user: userId });
  if (!folder) throw new AppError('Folder not found', 404);
  return folder;
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
    folderId: data.folderId,
    fileUrl: data.fileUrl,
    mimeType: data.mimeType,
    sizeBytes: data.sizeBytes,
    storageKey: data.storageKey,
  });
  logger.info({ userId, fileId: file._id }, '[LIBRARY] Added file');
  return file;
};

export const getFileByIdService = async (fileId: string, userId: string): Promise<ILibraryFile> => {
  const file = await LibraryFile.findOne({ _id: fileId, user: userId });
  if (!file) throw new AppError('File not found or unauthorized', 404);
  return file;
};

export const deleteFileService = async (fileId: string, userId: string): Promise<ILibraryFile> => {
  const file = await LibraryFile.findOneAndDelete({ _id: fileId, user: userId });
  if (!file) throw new AppError('File not found or unauthorized', 404);
  logger.info({ userId, fileId }, '[LIBRARY] Deleted file');
  return file;
};

export const updateFileService = async (fileId: string, userId: string, data: UpdateFileData): Promise<ILibraryFile> => {
  const file = await LibraryFile.findOne({ _id: fileId, user: userId });
  if (!file) throw new AppError('File not found or unauthorized', 404);

  if (typeof data.name === 'string' && data.name.trim()) {
    file.name = data.name.trim();
  }
  if (typeof data.type === 'string' && data.type.trim()) {
    file.type = data.type.trim();
  }
  if (typeof data.folder === 'string' && data.folder.trim()) {
    file.folder = data.folder.trim();
  }

  await file.save();
  logger.info({ userId, fileId }, '[LIBRARY] Updated file');
  return file;
};

export const getFilesByFolderService = async (userId: string, folder: string): Promise<ILibraryFile[]> => {
  return LibraryFile.find({ user: userId, folder }).sort({ createdAt: -1 });
};
