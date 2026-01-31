import React, { useState, useRef, useCallback } from 'react';
import {
  Button,
  Spinner,
  Text,
  ProgressBar,
  makeStyles,
  shorthands,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import {
  ArrowUpload24Regular,
  Document24Regular,
  Dismiss24Regular,
  Checkmark24Regular,
  Image24Regular,
  MusicNote224Regular,
  Video24Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';
import { adminApi } from '../services/api';

interface FileUploadProps {
  gameSlug: string;
  categorySlug?: string;
  onUploadComplete?: (files: UploadedFile[]) => void;
  multiple?: boolean;
  accept?: string;
}

interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  path: string;
}

interface FileItem {
  file: File;
  id: string;
  status: 'pending' | 'uploading' | 'success' | 'error';
  progress: number;
  result?: UploadedFile;
  error?: string;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  dropzone: {
    ...shorthands.border('2px', 'dashed', 'currentColor'),
    ...shorthands.borderRadius('12px'),
    ...shorthands.padding('40px'),
    textAlign: 'center',
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
  },
  dropzoneActive: {
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
  },
  dropzoneIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('8px'),
  },
  fileIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('8px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
  },
  fileInfo: {
    flexGrow: 1,
    minWidth: 0,
  },
  fileName: {
    fontWeight: '500',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  fileSize: {
    fontSize: '12px',
    opacity: 0.6,
  },
  fileStatus: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  actions: {
    display: 'flex',
    ...shorthands.gap('12px'),
    justifyContent: 'flex-end',
  },
});

const FileUpload: React.FC<FileUploadProps> = ({
  gameSlug,
  categorySlug,
  onUploadComplete,
  multiple = true,
  accept = 'image/*,audio/*,video/*,.pdf,.zip,.rar',
}) => {
  const styles = useStyles();
  const { colors, isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [files, setFiles] = useState<FileItem[]>([]);
  const [isDragActive, setIsDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return <Image24Regular />;
    if (mimeType.startsWith('audio/')) return <MusicNote224Regular />;
    if (mimeType.startsWith('video/')) return <Video24Regular />;
    return <Document24Regular />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = useCallback((selectedFiles: FileList | null) => {
    if (!selectedFiles) return;

    const newFiles: FileItem[] = Array.from(selectedFiles).map(file => ({
      file,
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending' as const,
      progress: 0,
    }));

    setFiles(prev => multiple ? [...prev, ...newFiles] : newFiles);
  }, [multiple]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  }, [handleFileSelect]);

  const handleRemoveFile = useCallback((id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  }, []);

  const handleUpload = async () => {
    if (files.length === 0) return;

    setIsUploading(true);
    setMessage(null);

    const pendingFiles = files.filter(f => f.status === 'pending');
    const uploadedFiles: UploadedFile[] = [];

    for (const fileItem of pendingFiles) {
      setFiles(prev => prev.map(f =>
        f.id === fileItem.id ? { ...f, status: 'uploading' as const, progress: 0 } : f
      ));

      try {
        const response = await adminApi.uploadFile(fileItem.file, gameSlug, categorySlug);

        if (response.data.success) {
          const result = response.data.data;
          uploadedFiles.push(result);
          setFiles(prev => prev.map(f =>
            f.id === fileItem.id ? { ...f, status: 'success' as const, progress: 100, result } : f
          ));
        } else {
          throw new Error('上传失败');
        }
      } catch (error: any) {
        setFiles(prev => prev.map(f =>
          f.id === fileItem.id ? {
            ...f,
            status: 'error' as const,
            error: error.response?.data?.message || error.message || '上传失败'
          } : f
        ));
      }
    }

    setIsUploading(false);

    if (uploadedFiles.length > 0) {
      setMessage({ type: 'success', text: `成功上传 ${uploadedFiles.length} 个文件` });
      onUploadComplete?.(uploadedFiles);
    }

    if (uploadedFiles.length < pendingFiles.length) {
      const failedCount = pendingFiles.length - uploadedFiles.length;
      setMessage({
        type: 'error',
        text: `${failedCount} 个文件上传失败`
      });
    }
  };

  const handleClear = () => {
    setFiles([]);
    setMessage(null);
  };

  return (
    <div className={styles.container}>
      {/* Message */}
      {message && (
        <MessageBar intent={message.type}>
          <MessageBarBody>{message.text}</MessageBarBody>
        </MessageBar>
      )}

      {/* Dropzone */}
      <div
        className={`${styles.dropzone} ${isDragActive ? styles.dropzoneActive : ''}`}
        style={{
          borderColor: isDragActive ? (isDark ? '#667eea' : '#6366f1') : colors.border,
          backgroundColor: isDragActive
            ? (isDark ? 'rgba(102, 126, 234, 0.1)' : 'rgba(99, 102, 241, 0.05)')
            : colors.cardBg,
        }}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <ArrowUpload24Regular
          className={styles.dropzoneIcon}
          style={{ color: isDark ? '#667eea' : '#6366f1' }}
        />
        <Text style={{ color: colors.textPrimary, display: 'block', marginBottom: '8px' }}>
          拖拽文件到这里，或点击选择文件
        </Text>
        <Text style={{ color: colors.textMuted, fontSize: '14px' }}>
          支持图片、音频、视频、PDF、压缩包等格式
        </Text>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className={styles.fileList}>
          {files.map(fileItem => (
            <div
              key={fileItem.id}
              className={styles.fileItem}
              style={{
                backgroundColor: colors.cardBg,
                border: `1px solid ${colors.border}`,
              }}
            >
              <div
                className={styles.fileIcon}
                style={{
                  backgroundColor: isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(99, 102, 241, 0.1)',
                  color: isDark ? '#667eea' : '#6366f1',
                }}
              >
                {getFileIcon(fileItem.file.type)}
              </div>

              <div className={styles.fileInfo}>
                <div className={styles.fileName} style={{ color: colors.textPrimary }}>
                  {fileItem.file.name}
                </div>
                <div className={styles.fileSize} style={{ color: colors.textMuted }}>
                  {formatFileSize(fileItem.file.size)}
                </div>
                {fileItem.status === 'uploading' && (
                  <ProgressBar value={fileItem.progress / 100} style={{ marginTop: '4px' }} />
                )}
                {fileItem.error && (
                  <Text style={{ color: colors.error, fontSize: '12px' }}>
                    {fileItem.error}
                  </Text>
                )}
              </div>

              <div className={styles.fileStatus}>
                {fileItem.status === 'pending' && (
                  <Button
                    appearance="subtle"
                    icon={<Dismiss24Regular />}
                    size="small"
                    onClick={() => handleRemoveFile(fileItem.id)}
                  />
                )}
                {fileItem.status === 'uploading' && <Spinner size="tiny" />}
                {fileItem.status === 'success' && (
                  <Checkmark24Regular style={{ color: colors.success }} />
                )}
                {fileItem.status === 'error' && (
                  <Button
                    appearance="subtle"
                    icon={<Dismiss24Regular />}
                    size="small"
                    onClick={() => handleRemoveFile(fileItem.id)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Actions */}
      {files.length > 0 && (
        <div className={styles.actions}>
          <Button
            appearance="subtle"
            onClick={handleClear}
            disabled={isUploading}
          >
            清空
          </Button>
          <Button
            appearance="primary"
            icon={<ArrowUpload24Regular />}
            onClick={handleUpload}
            disabled={isUploading || files.every(f => f.status !== 'pending')}
          >
            {isUploading ? '上传中...' : '开始上传'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

