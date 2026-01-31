import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Spinner,
  Text,
  Badge,
  makeStyles,
  shorthands,
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
  Info24Regular,
  Share24Regular,
  Heart24Regular,
  ZoomIn24Regular,
} from '@fluentui/react-icons';
import { api, Material } from '../services/api';
import ImageLightbox from '../components/ImageLightbox';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

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
    cursor: 'pointer',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.2s',
    ':hover': {
      transform: 'scale(1.02)',
      boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
    },
  },
  imageOverlay: {
    position: 'absolute' as const,
    bottom: '16px',
    right: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    ...shorthands.padding('8px', '16px'),
    ...shorthands.borderRadius('8px'),
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: 'white',
    fontSize: '14px',
    pointerEvents: 'none' as const,
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
  const { colors, isDark } = useTheme();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [material, setMaterial] = useState<Material | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [lightboxOpen, setLightboxOpen] = useState(false);
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
      <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
        <div className={styles.spinnerContainer}>
          <Spinner size="large" />
          <Text style={{ color: colors.textSecondary }}>加载中...</Text>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
        <div className={styles.spinnerContainer}>
          <Text style={{ color: colors.textPrimary, fontSize: '24px', marginBottom: '16px' }}>素材不存在</Text>
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
    <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
      {/* Header */}
      <header style={{
        background: colors.headerBg,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: `0 4px 20px ${colors.shadow}`,
      }}>
        <div style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '24px' }} onClick={() => navigate('/')}>
          HOYODB
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <ThemeToggle className={styles.headerButton} />
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
      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px' }}>
        {/* Back Button */}
        <Button
          appearance="subtle"
          icon={<ArrowLeft24Regular />}
          style={{ marginBottom: '24px', color: colors.textSecondary }}
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
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: '32px',
        }} className="responsive-detail-grid">
          {/* Preview Section */}
          <div style={{
            backgroundColor: colors.cardBg,
            borderRadius: '20px',
            overflow: 'hidden',
            border: `1px solid ${colors.border}`,
          }}>
            <div style={{
              position: 'relative',
              minHeight: '400px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: colors.gradientSecondary,
            }}>
              {isImage && (
                <div style={{ position: 'relative', cursor: 'pointer' }} onClick={() => setLightboxOpen(true)}>
                  <img
                    src={material.filePath}
                    alt={material.title}
                    style={{ maxWidth: '100%', maxHeight: '600px', objectFit: 'contain' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    color: 'white',
                    fontSize: '14px',
                    pointerEvents: 'none',
                  }}>
                    <ZoomIn24Regular />
                    点击放大
                  </div>
                </div>
              )}

              {isAudio && (
                <div style={{ textAlign: 'center', padding: '60px' }}>
                  <div
                    style={{
                      width: '120px',
                      height: '120px',
                      borderRadius: '50%',
                      background: colors.gradientPrimary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 32px',
                      boxShadow: isDark ? '0 10px 40px rgba(102, 126, 234, 0.4)' : '0 10px 40px rgba(99, 102, 241, 0.3)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                    }}
                    onClick={togglePlay}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {isPlaying ? (
                      <Pause24Filled style={{ fontSize: '48px', color: 'white' }} />
                    ) : (
                      <Play24Filled style={{ fontSize: '48px', color: 'white' }} />
                    )}
                  </div>
                  <Text style={{ color: colors.textPrimary, fontSize: '18px' }}>
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
                  style={{ width: '100%', maxHeight: '600px' }}
                />
              )}

              {!isImage && !isAudio && !isVideo && (
                <div style={{ textAlign: 'center', padding: '80px' }}>
                  <Document24Regular style={{ fontSize: '80px', color: colors.textMuted, marginBottom: '16px' }} />
                  <Text style={{ color: colors.textSecondary }}>此文件类型不支持预览</Text>
                </div>
              )}
            </div>

            {isAudio && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                padding: '24px',
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              }}>
                <Slider
                  value={currentTime}
                  max={duration || 100}
                  onChange={(e, data) => handleSeek(data.value)}
                  style={{ width: '100%', maxWidth: '400px' }}
                />
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  maxWidth: '400px',
                  color: colors.textMuted,
                  fontSize: '12px',
                }}>
                  <span>{formatDuration(Math.floor(currentTime))}</span>
                  <span>{formatDuration(Math.floor(duration))}</span>
                </div>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Main Info Card */}
            <div style={{
              backgroundColor: colors.cardBg,
              borderRadius: '20px',
              padding: '28px',
              border: `1px solid ${colors.border}`,
            }}>
              <h1 style={{
                color: colors.textPrimary,
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '16px',
                lineHeight: '1.3',
              }}>{material.title}</h1>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
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
                <p style={{ color: colors.textSecondary, fontSize: '15px', lineHeight: '1.6', marginBottom: '24px' }}>
                  {material.description}
                </p>
              )}

              <div style={{ height: '1px', backgroundColor: colors.border, marginBottom: '20px' }} />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Document24Regular style={{ fontSize: 16 }} />
                    文件大小
                  </span>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{formatFileSize(material.fileSize)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: colors.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info24Regular style={{ fontSize: 16 }} />
                    文件类型
                  </span>
                  <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{material.fileType}</span>
                </div>
                {material.resolution && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Image24Regular style={{ fontSize: 16 }} />
                      分辨率
                    </span>
                    <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{material.resolution}</span>
                  </div>
                )}
                {material.duration && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textMuted, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Clock24Regular style={{ fontSize: 16 }} />
                      时长
                    </span>
                    <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{formatDuration(material.duration)}</span>
                  </div>
                )}
                {material.version && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: colors.textMuted, fontSize: '14px' }}>
                      游戏版本
                    </span>
                    <span style={{ color: colors.textPrimary, fontSize: '14px', fontWeight: '500' }}>{material.version}</span>
                  </div>
                )}
              </div>

              {material.tags && material.tags.length > 0 && (
                <>
                  <div style={{ height: '1px', backgroundColor: colors.border, marginTop: '20px' }} />
                  <Text style={{ color: colors.textMuted, marginBottom: 12, display: 'block', marginTop: '20px' }}>
                    标签
                  </Text>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
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
            <div style={{
              backgroundColor: colors.cardBg,
              borderRadius: '20px',
              padding: '24px',
              border: `1px solid ${colors.border}`,
            }}>
              <Button
                appearance="primary"
                icon={<ArrowDownload24Regular />}
                style={{
                  width: '100%',
                  height: '56px',
                  borderRadius: '14px',
                  background: colors.gradientPrimary,
                  fontWeight: '600',
                  fontSize: '16px',
                  border: 'none',
                  boxShadow: isDark ? '0 8px 24px rgba(102, 126, 234, 0.4)' : '0 8px 24px rgba(99, 102, 241, 0.3)',
                }}
                onClick={handleDownload}
              >
                免费下载
              </Button>

              <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
                <Button
                  appearance="subtle"
                  icon={<Share24Regular />}
                  style={{
                    flex: 1,
                    color: colors.textSecondary,
                    backgroundColor: colors.buttonBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  分享
                </Button>
                <Button
                  appearance="subtle"
                  icon={<Heart24Regular />}
                  style={{
                    flex: 1,
                    color: colors.textSecondary,
                    backgroundColor: colors.buttonBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  收藏
                </Button>
              </div>

              <div style={{
                display: 'flex',
                justifyContent: 'space-around',
                padding: '16px 0',
                marginTop: '16px',
                borderTop: `1px solid ${colors.border}`,
              }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: 'bold' }}>{material.downloadCount}</div>
                  <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>下载次数</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ color: colors.textPrimary, fontSize: '24px', fontWeight: 'bold' }}>
                    {new Date(material.uploadTime).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })}
                  </div>
                  <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '4px' }}>上传日期</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.footerBg,
        padding: '24px 32px',
        textAlign: 'center',
        borderTop: `1px solid ${colors.border}`,
        marginTop: '48px',
      }}>
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>
          HOYODB ©{new Date().getFullYear()} | 仅供学习交流使用，素材版权归米哈游所有
        </p>
      </footer>

      {/* Image Lightbox */}
      {isImage && (
        <ImageLightbox
          src={material.filePath}
          alt={material.title}
          isOpen={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
};

export default MaterialDetailPage;

