import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Spinner,
  Text,
  Badge,
  makeStyles,
  shorthands,
  tokens,
  MessageBar,
  MessageBarBody,
  Slider,
} from '@fluentui/react-components';
import {
  Home24Regular,
  ArrowDownload24Regular,
  Play24Filled,
  Pause24Filled,
  ArrowLeft24Regular,
  Document24Regular,
  Clock24Regular,
  Image24Regular,
  MusicNote224Regular,
  Video24Regular,
  Info24Regular,
  Share24Regular,
  Heart24Regular,
} from '@fluentui/react-icons';
import { api, Material } from '../services/api';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ...shorthands.padding('16px', '32px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky' as const,
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
  },
  headerTitle: {
    color: 'white',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '24px',
  },
  headerNav: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  headerButton: {
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  content: {
    maxWidth: '1400px',
    ...shorthands.margin('0', 'auto'),
    ...shorthands.padding('32px'),
  },
  backButton: {
    marginBottom: '24px',
    color: 'rgba(255, 255, 255, 0.7)',
    ':hover': {
      color: 'white',
    },
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 420px',
    ...shorthands.gap('32px'),
    '@media (max-width: 1024px)': {
      gridTemplateColumns: '1fr',
    },
  },
  previewSection: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('20px'),
    ...shorthands.overflow('hidden'),
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  previewContainer: {
    position: 'relative' as const,
    minHeight: '400px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  },
  previewImage: {
    maxWidth: '100%',
    maxHeight: '600px',
    objectFit: 'contain' as const,
  },
  audioPreview: {
    textAlign: 'center',
    ...shorthands.padding('60px'),
  },
  audioIconWrapper: {
    width: '120px',
    height: '120px',
    ...shorthands.borderRadius('50%'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.margin('0', 'auto', '32px'),
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
    cursor: 'pointer',
    transitionProperty: 'transform',
    transitionDuration: '0.2s',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  audioIcon: {
    fontSize: '48px',
    color: 'white',
  },
  audioControls: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('24px'),
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  audioProgress: {
    width: '100%',
    maxWidth: '400px',
  },
  audioTime: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: '400px',
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
  },
  videoPlayer: {
    width: '100%',
    maxHeight: '600px',
  },
  noPreview: {
    textAlign: 'center',
    ...shorthands.padding('80px'),
  },
  noPreviewIcon: {
    fontSize: '80px',
    color: 'rgba(255, 255, 255, 0.2)',
    marginBottom: '16px',
  },
  noPreviewText: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  infoSection: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('24px'),
  },
  infoCard: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('20px'),
    ...shorthands.padding('28px'),
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  title: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '16px',
    lineHeight: '1.3',
  },
  tags: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
    marginBottom: '20px',
  },
  description: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '15px',
    lineHeight: '1.6',
    marginBottom: '24px',
  },
  divider: {
    height: '1px',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.margin('0', '0', '20px'),
  },
  infoList: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  infoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
  infoValue: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  materialTags: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
  },
  actionCard: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('20px'),
    ...shorthands.padding('24px'),
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  downloadButton: {
    width: '100%',
    height: '56px',
    ...shorthands.borderRadius('14px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: '600',
    fontSize: '16px',
    ...shorthands.border('none'),
    boxShadow: '0 8px 24px rgba(102, 126, 234, 0.4)',
    ':hover': {
      background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
      transform: 'translateY(-2px)',
    },
  },
  actionButtons: {
    display: 'flex',
    ...shorthands.gap('12px'),
    marginTop: '16px',
  },
  actionButton: {
    flex: 1,
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-around',
    ...shorthands.padding('16px', '0'),
    marginTop: '16px',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  statItem: {
    textAlign: 'center',
  },
  statValue: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
    marginTop: '4px',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  footer: {
    backgroundColor: '#0a0a14',
    ...shorthands.padding('24px', '32px'),
    textAlign: 'center',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    marginTop: '48px',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
  },
});

const formatFileSize = (bytes: string | number) => {
  const size = typeof bytes === 'string' ? parseInt(bytes) : bytes;
  if (size < 1024) return size + ' B';
  if (size < 1024 * 1024) return (size / 1024).toFixed(1) + ' KB';
  if (size < 1024 * 1024 * 1024) return (size / 1024 / 1024).toFixed(1) + ' MB';
  return (size / 1024 / 1024 / 1024).toFixed(1) + ' GB';
};

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const MaterialDetailPage: React.FC = () => {
  const styles = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    loadMaterial();
  }, [id]);

  const loadMaterial = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const response = await api.getMaterial(parseInt(id));
      setMaterial(response.data.data);
    } catch (error) {
      console.error('加载素材详情失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!material) return;

    try {
      await api.recordDownload(material.id);

      const link = document.createElement('a');
      link.href = material.filePath;
      link.download = material.title;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setMessage({ type: 'success', text: '开始下载' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: '下载失败' });
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };

  if (loading) {
    return (
      <div className={styles.root}>
        <div className={styles.spinnerContainer}>
          <Spinner size="large" />
          <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>加载中...</Text>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className={styles.root}>
        <div className={styles.spinnerContainer}>
          <Text style={{ color: 'white', fontSize: '24px', marginBottom: '16px' }}>素材不存在</Text>
          <Button appearance="primary" onClick={() => navigate(-1)}>
            返回
          </Button>
        </div>
      </div>
    );
  }

  const isAudio = material.fileType.startsWith('audio/');
  const isImage = material.fileType.startsWith('image/');
  const isVideo = material.fileType.startsWith('video/');

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle} onClick={() => navigate('/')}>
          HOYODB
        </div>
        <div className={styles.headerNav}>
          <Button
            appearance="subtle"
            icon={<Home24Regular />}
            className={styles.headerButton}
            onClick={() => navigate('/')}
          >
            返回首页
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className={styles.content}>
        {/* Back Button */}
        <Button
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          返回列表
        </Button>

        {/* Message */}
        {message.text && (
          <MessageBar
            intent={message.type === 'success' ? 'success' : 'error'}
            style={{ marginBottom: 24, borderRadius: 12 }}
          >
            <MessageBarBody>{message.text}</MessageBarBody>
          </MessageBar>
        )}

        {/* Grid */}
        <div className={styles.grid}>
          {/* Preview Section */}
          <div className={styles.previewSection}>
            <div className={styles.previewContainer}>
              {isImage && (
                <img
                  src={material.filePath}
                  alt={material.title}
                  className={styles.previewImage}
                />
              )}

              {isAudio && (
                <div className={styles.audioPreview}>
                  <div className={styles.audioIconWrapper} onClick={togglePlay}>
                    {isPlaying ? (
                      <Pause24Filled className={styles.audioIcon} />
                    ) : (
                      <Play24Filled className={styles.audioIcon} />
                    )}
                  </div>
                  <Text style={{ color: 'white', fontSize: '18px' }}>
                    {material.title}
                  </Text>
                  <audio
                    ref={audioRef}
                    src={material.filePath}
                    onEnded={() => setIsPlaying(false)}
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    style={{ display: 'none' }}
                  />
                </div>
              )}

              {isVideo && (
                <video
                  src={material.filePath}
                  controls
                  className={styles.videoPlayer}
                />
              )}

              {!isImage && !isAudio && !isVideo && (
                <div className={styles.noPreview}>
                  <Document24Regular className={styles.noPreviewIcon} />
                  <Text className={styles.noPreviewText}>此文件类型不支持预览</Text>
                </div>
              )}
            </div>

            {isAudio && (
              <div className={styles.audioControls}>
                <Slider
                  value={currentTime}
                  max={duration || 100}
                  onChange={(e, data) => handleSeek(data.value)}
                  className={styles.audioProgress}
                />
                <div className={styles.audioTime}>
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{formatDuration(Math.floor(duration))}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className={styles.infoSection}>
            {/* Main Info Card */}
            <div className={styles.infoCard}>
              <h1 className={styles.title}>{material.title}</h1>

              <div className={styles.tags}>
                <Badge appearance="filled" color="brand" shape="rounded">
                  {material.game?.name}
                </Badge>
                <Badge appearance="tint" color="success" shape="rounded">
                  {material.category?.name}
                </Badge>
                {material.isFeatured && (
                  <Badge appearance="filled" color="warning" shape="rounded">
                    精选
                  </Badge>
                )}
              </div>

              {material.description && (
                <p className={styles.description}>{material.description}</p>
              )}

              <div className={styles.divider} />

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <Document24Regular style={{ fontSize: 16 }} />
                    文件大小
                  </span>
                  <span className={styles.infoValue}>{formatFileSize(material.fileSize)}</span>
                </div>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>
                    <Info24Regular style={{ fontSize: 16 }} />
                    文件类型
                  </span>
                  <span className={styles.infoValue}>{material.fileType}</span>
                </div>
                {material.resolution && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Image24Regular style={{ fontSize: 16 }} />
                      分辨率
                    </span>
                    <span className={styles.infoValue}>{material.resolution}</span>
                  </div>
                )}
                {material.duration && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      <Clock24Regular style={{ fontSize: 16 }} />
                      时长
                    </span>
                    <span className={styles.infoValue}>{formatDuration(material.duration)}</span>
                  </div>
                )}
                {material.version && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>
                      游戏版本
                    </span>
                    <span className={styles.infoValue}>{material.version}</span>
                  </div>
                )}
              </div>

              {material.tags && material.tags.length > 0 && (
                <>
                  <div className={styles.divider} style={{ marginTop: 20 }} />
                  <Text style={{ color: 'rgba(255, 255, 255, 0.5)', marginBottom: 12, display: 'block' }}>
                    标签
                  </Text>
                  <div className={styles.materialTags}>
                    {material.tags.map(({ tag }) => (
                      <Badge key={tag.id} appearance="outline" shape="rounded">
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Action Card */}
            <div className={styles.actionCard}>
              <Button
                appearance="primary"
                icon={<ArrowDownload24Regular />}
                className={styles.downloadButton}
                onClick={handleDownload}
              >
                免费下载
              </Button>

              <div className={styles.actionButtons}>
                <Button
                  appearance="subtle"
                  icon={<Share24Regular />}
                  className={styles.actionButton}
                >
                  分享
                </Button>
                <Button
                  appearance="subtle"
                  icon={<Heart24Regular />}
                  className={styles.actionButton}
                >
                  收藏
                </Button>
              </div>

              <div className={styles.statsRow}>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>{material.downloadCount}</div>
                  <div className={styles.statLabel}>下载次数</div>
                </div>
                <div className={styles.statItem}>
                  <div className={styles.statValue}>
                    {new Date(material.uploadTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className={styles.statLabel}>上传日期</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          HOYODB ©{new Date().getFullYear()} | 仅供学习交流使用，素材版权归米哈游所有
        </p>
      </footer>
    </div>
  );
};

export default MaterialDetailPage;

