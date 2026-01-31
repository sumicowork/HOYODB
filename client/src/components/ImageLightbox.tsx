import React, { useEffect, useCallback } from 'react';
import {
  Button,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  Dismiss24Regular,
  ZoomIn24Regular,
  ZoomOut24Regular,
  ArrowDownload24Regular,
} from '@fluentui/react-icons';

interface ImageLightboxProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: () => void;
}

const useStyles = makeStyles({
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'fadeIn 0.2s ease-out',
  },
  toolbar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    ...shorthands.padding('16px', '24px'),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
  },
  title: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '500',
    maxWidth: '60%',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  toolbarButtons: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  toolButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.2)'),
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
  },
  closeButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 0, 0, 0.3)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 0, 0, 0.5)'),
    ':hover': {
      backgroundColor: 'rgba(255, 0, 0, 0.5)',
    },
  },
  imageContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',
    ...shorthands.padding('80px', '40px', '40px'),
    cursor: 'zoom-out',
    overflowY: 'auto',
  },
  image: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    ...shorthands.borderRadius('8px'),
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
    transitionProperty: 'transform',
    transitionDuration: '0.3s',
    transitionTimingFunction: 'ease-out',
  },
  imageZoomed: {
    maxWidth: 'none',
    maxHeight: 'none',
    cursor: 'zoom-in',
  },
  hint: {
    position: 'absolute',
    bottom: '24px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    textAlign: 'center',
  },
});

const ImageLightbox: React.FC<ImageLightboxProps> = ({
  src,
  alt,
  isOpen,
  onClose,
  onDownload,
}) => {
  const styles = useStyles();
  const [zoom, setZoom] = React.useState(1);
  const [isZoomed, setIsZoomed] = React.useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === '+' || e.key === '=') {
      setZoom((prev) => Math.min(prev + 0.25, 3));
    } else if (e.key === '-') {
      setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Reset zoom when closing
  useEffect(() => {
    if (!isOpen) {
      setZoom(1);
      setIsZoomed(false);
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isZoomed) {
      setZoom(1);
      setIsZoomed(false);
    } else {
      setZoom(2);
      setIsZoomed(true);
    }
  };

  const handleOverlayClick = () => {
    if (!isZoomed) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      {/* Toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.title}>{alt}</span>
        <div className={styles.toolbarButtons}>
          <Button
            appearance="subtle"
            icon={<ZoomOut24Regular />}
            className={styles.toolButton}
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            title="缩小"
          />
          <Button
            appearance="subtle"
            icon={<ZoomIn24Regular />}
            className={styles.toolButton}
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            title="放大"
          />
          {onDownload && (
            <Button
              appearance="subtle"
              icon={<ArrowDownload24Regular />}
              className={styles.toolButton}
              onClick={onDownload}
              title="下载"
            />
          )}
          <Button
            appearance="subtle"
            icon={<Dismiss24Regular />}
            className={styles.closeButton}
            onClick={onClose}
            title="关闭 (Esc)"
          />
        </div>
      </div>

      {/* Image */}
      <div className={styles.imageContainer} onClick={handleOverlayClick}>
        <img
          src={src}
          alt={alt}
          className={`${styles.image} ${isZoomed ? styles.imageZoomed : ''}`}
          style={{ transform: `scale(${zoom})` }}
          onClick={handleImageClick}
          draggable={false}
        />
      </div>

      {/* Hint */}
      <div className={styles.hint}>
        按 ESC 关闭 | 按 +/- 缩放 | 点击图片切换缩放
      </div>
    </div>
  );
};

export default ImageLightbox;

