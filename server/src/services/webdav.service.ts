import { createClient, WebDAVClient, FileStat } from 'webdav';
import path from 'path';

// WebDAV 配置
const WEBDAV_URL = process.env.WEBDAV_URL || 'http://localhost:5244/dav';
const WEBDAV_USERNAME = process.env.WEBDAV_USERNAME || 'admin';
const WEBDAV_PASSWORD = process.env.WEBDAV_PASSWORD || 'admin';
const WEBDAV_BASE_PATH = process.env.WEBDAV_BASE_PATH || '/hoyodb';

// 创建 WebDAV 客户端
let client: WebDAVClient | null = null;

export const getWebDAVClient = (): WebDAVClient => {
  if (!client) {
    client = createClient(WEBDAV_URL, {
      username: WEBDAV_USERNAME,
      password: WEBDAV_PASSWORD,
    });
  }
  return client;
};

// 确保目录存在
export const ensureDirectory = async (dirPath: string): Promise<void> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, dirPath);

  try {
    const exists = await webdav.exists(fullPath);
    if (!exists) {
      // 递归创建目录
      const parts = fullPath.split('/').filter(Boolean);
      let currentPath = '';

      for (const part of parts) {
        currentPath += '/' + part;
        const partExists = await webdav.exists(currentPath);
        if (!partExists) {
          await webdav.createDirectory(currentPath);
        }
      }
    }
  } catch (error) {
    console.error('创建目录失败:', error);
    throw error;
  }
};

// 上传文件
export const uploadFile = async (
  localBuffer: Buffer,
  remotePath: string,
  filename: string
): Promise<string> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath, filename);

  try {
    // 确保目录存在
    await ensureDirectory(remotePath);

    // 上传文件
    await webdav.putFileContents(fullPath, localBuffer);

    // 返回文件的访问路径
    return getFileUrl(remotePath, filename);
  } catch (error) {
    console.error('上传文件失败:', error);
    throw error;
  }
};

// 获取文件 URL
export const getFileUrl = (remotePath: string, filename: string): string => {
  // OpenList 的公开访问 URL 格式
  const baseUrl = process.env.OPENLIST_PUBLIC_URL || 'http://localhost:5244/d';
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath, filename);
  return `${baseUrl}${fullPath}`;
};

// 删除文件
export const deleteFile = async (remotePath: string, filename: string): Promise<void> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath, filename);

  try {
    const exists = await webdav.exists(fullPath);
    if (exists) {
      await webdav.deleteFile(fullPath);
    }
  } catch (error) {
    console.error('删除文件失败:', error);
    throw error;
  }
};

// 列出目录内容
export const listDirectory = async (remotePath: string): Promise<FileStat[]> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath);

  try {
    const exists = await webdav.exists(fullPath);
    if (!exists) {
      return [];
    }

    const contents = await webdav.getDirectoryContents(fullPath) as FileStat[];
    return contents;
  } catch (error) {
    console.error('列出目录失败:', error);
    throw error;
  }
};

// 检查文件是否存在
export const fileExists = async (remotePath: string, filename: string): Promise<boolean> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath, filename);

  try {
    return await webdav.exists(fullPath);
  } catch (error) {
    console.error('检查文件失败:', error);
    return false;
  }
};

// 获取文件信息
export const getFileInfo = async (remotePath: string, filename: string): Promise<FileStat | null> => {
  const webdav = getWebDAVClient();
  const fullPath = path.posix.join(WEBDAV_BASE_PATH, remotePath, filename);

  try {
    const exists = await webdav.exists(fullPath);
    if (!exists) {
      return null;
    }

    const stat = await webdav.stat(fullPath) as FileStat;
    return stat;
  } catch (error) {
    console.error('获取文件信息失败:', error);
    return null;
  }
};

// 复制文件
export const copyFile = async (
  sourcePath: string,
  sourceFilename: string,
  destPath: string,
  destFilename: string
): Promise<void> => {
  const webdav = getWebDAVClient();
  const sourceFullPath = path.posix.join(WEBDAV_BASE_PATH, sourcePath, sourceFilename);
  const destFullPath = path.posix.join(WEBDAV_BASE_PATH, destPath, destFilename);

  try {
    await ensureDirectory(destPath);
    await webdav.copyFile(sourceFullPath, destFullPath);
  } catch (error) {
    console.error('复制文件失败:', error);
    throw error;
  }
};

// 移动文件
export const moveFile = async (
  sourcePath: string,
  sourceFilename: string,
  destPath: string,
  destFilename: string
): Promise<void> => {
  const webdav = getWebDAVClient();
  const sourceFullPath = path.posix.join(WEBDAV_BASE_PATH, sourcePath, sourceFilename);
  const destFullPath = path.posix.join(WEBDAV_BASE_PATH, destPath, destFilename);

  try {
    await ensureDirectory(destPath);
    await webdav.moveFile(sourceFullPath, destFullPath);
  } catch (error) {
    console.error('移动文件失败:', error);
    throw error;
  }
};

// 获取存储空间信息
export const getStorageInfo = async (): Promise<{ used: number; available: number } | null> => {
  const webdav = getWebDAVClient();

  try {
    const quota = await webdav.getQuota() as { used?: number; available?: number } | null;
    if (quota && typeof quota === 'object') {
      return {
        used: quota.used || 0,
        available: quota.available || 0,
      };
    }
    return null;
  } catch (error) {
    console.error('获取存储信息失败:', error);
    return null;
  }
};

export default {
  getWebDAVClient,
  ensureDirectory,
  uploadFile,
  getFileUrl,
  deleteFile,
  listDirectory,
  fileExists,
  getFileInfo,
  copyFile,
  moveFile,
  getStorageInfo,
};

