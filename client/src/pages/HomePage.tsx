import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Text,
  Title2,
  Badge,
  Spinner,
  Button,
  makeStyles,
  shorthands,
} from '@fluentui/react-components';
import {
  Rocket24Regular,
  Star24Regular,
  Flash24Regular,
  MusicNote224Regular,
  Image24Regular,
  ArrowDownload24Regular,
  Settings24Regular,
} from '@fluentui/react-icons';
import { api, Game, Material } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import { useTheme } from '../contexts/ThemeContext';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    backgroundColor: '#0f0f1a',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    ...shorthands.padding('16px', '48px'),
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
    fontWeight: 'bold',
    fontSize: '24px',
    cursor: 'pointer',
  },
  headerNav: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  headerButton: {
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
  },
  hero: {
    background: 'linear-gradient(180deg, rgba(102, 126, 234, 0.3) 0%, rgba(15, 15, 26, 1) 100%)',
    ...shorthands.padding('80px', '48px'),
    textAlign: 'center',
  },
  heroTitle: {
    color: 'white',
    fontSize: '48px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textShadow: '0 4px 20px rgba(102, 126, 234, 0.5)',
  },
  heroSubtitle: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '18px',
    maxWidth: '600px',
    ...shorthands.margin('0', 'auto'),
  },
  content: {
    ...shorthands.padding('0', '48px', '80px'),
    maxWidth: '1400px',
    ...shorthands.margin('0', 'auto'),
  },
  sectionTitle: {
    color: 'white',
    marginBottom: '32px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  sectionTitleIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('10px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    ...shorthands.gap('24px'),
    marginBottom: '80px',
  },
  gameCard: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('16px'),
    ...shorthands.overflow('hidden'),
    cursor: 'pointer',
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.3s',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    ':hover': {
      transform: 'translateY(-8px)',
      boxShadow: '0 20px 40px rgba(102, 126, 234, 0.3)',
    },
  },
  gameCardDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
    ':hover': {
      transform: 'none',
      boxShadow: 'none',
    },
  },
  gameCardPreview: {
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    ...shorthands.overflow('hidden'),
  },
  gameCardPreviewStarrail: {
    background: 'linear-gradient(135deg, #6b5ce7 0%, #4a3f9f 100%)',
  },
  gameCardPreviewGenshin: {
    background: 'linear-gradient(135deg, #5cb85c 0%, #3d8b3d 100%)',
  },
  gameCardPreviewZzz: {
    background: 'linear-gradient(135deg, #f0ad4e 0%, #c7920e 100%)',
  },
  gameIcon: {
    fontSize: '64px',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  gameCardContent: {
    ...shorthands.padding('24px'),
  },
  gameTitle: {
    color: 'white',
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '8px',
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  gameDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
  },
  featuresSection: {
    marginTop: '40px',
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    ...shorthands.gap('24px'),
  },
  featureCard: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('16px'),
    ...shorthands.padding('32px'),
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    textAlign: 'center',
    transitionProperty: 'transform, border-color',
    transitionDuration: '0.3s',
    ':hover': {
      ...shorthands.borderColor('rgba(102, 126, 234, 0.5)'),
      transform: 'translateY(-4px)',
    },
  },
  featureIcon: {
    width: '64px',
    height: '64px',
    ...shorthands.borderRadius('16px'),
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.margin('0', 'auto', '20px'),
    fontSize: '28px',
    color: '#667eea',
  },
  featureTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '12px',
  },
  featureDescription: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '14px',
    lineHeight: '1.6',
  },
  footer: {
    backgroundColor: '#0a0a14',
    ...shorthands.padding('32px', '48px'),
    textAlign: 'center',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '14px',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('100px'),
  },
});

const gameIcons: Record<string, React.ReactNode> = {
  starrail: <Rocket24Regular />,
  genshin: <Star24Regular />,
  zzz: <Flash24Regular />,
};

const gamePreviewStyles: Record<string, string> = {
  starrail: 'gameCardPreviewStarrail',
  genshin: 'gameCardPreviewGenshin',
  zzz: 'gameCardPreviewZzz',
};

const HomePage: React.FC = () => {
  const styles = useStyles();
  const { colors, isDark } = useTheme();
  const [games, setGames] = useState<Game[]>([]);
  const [popularMaterials, setPopularMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [gamesRes, popularRes] = await Promise.all([
        api.getGames(),
        api.getPopularMaterials(6),
      ]);
      setGames(gamesRes.data.data);
      setPopularMaterials(popularRes.data.data);
    } catch (error) {
      console.error('加载数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGameClick = (slug: string, isActive: boolean) => {
    if (isActive) {
      navigate(`/game/${slug}`);
    }
  };

  const getPreviewClass = (slug: string) => {
    switch (slug) {
      case 'starrail':
        return styles.gameCardPreviewStarrail;
      case 'genshin':
        return styles.gameCardPreviewGenshin;
      case 'zzz':
        return styles.gameCardPreviewZzz;
      default:
        return '';
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
      {/* Header */}
      <header style={{
        background: colors.headerBg,
        padding: '16px 48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: `0 4px 20px ${colors.shadow}`,
      }}>
        <div style={{ color: 'white', fontWeight: 'bold', fontSize: '24px', cursor: 'pointer' }}>
          HOYODB
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <ThemeToggle className={styles.headerButton} />
          <Button
            appearance="subtle"
            icon={<Settings24Regular />}
            className={styles.headerButton}
            onClick={() => navigate('/admin/login')}
          >
            管理后台
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: isDark
          ? 'linear-gradient(180deg, rgba(102, 126, 234, 0.3) 0%, rgba(15, 15, 26, 1) 100%)'
          : 'linear-gradient(180deg, rgba(99, 102, 241, 0.2) 0%, #f5f7fa 100%)',
        padding: '80px 48px',
        textAlign: 'center',
      }}>
        <h1 style={{
          color: colors.textPrimary,
          fontSize: '48px',
          fontWeight: 'bold',
          marginBottom: '16px',
          textShadow: isDark ? '0 4px 20px rgba(102, 126, 234, 0.5)' : 'none',
        }}>
          米哈游游戏素材数据库
        </h1>
        <p style={{
          color: colors.textSecondary,
          fontSize: '18px',
          maxWidth: '600px',
          margin: '0 auto',
        }}>
          免费下载米哈游游戏的音乐、立绘、UI素材等资源，为创作者提供高质量素材支持
        </p>
      </section>

      {/* Content */}
      <main style={{ padding: '0 48px 80px', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Games Section */}
        <section>
          <div style={{
            color: colors.textPrimary,
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <Star24Regular />
            </div>
            <Title2 style={{ color: colors.textPrimary, margin: 0 }}>选择游戏</Title2>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
              <Spinner size="large" label="加载中..." />
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
              gap: '24px',
              marginBottom: '80px',
            }}>
              {games.map((game) => (
                <div
                  key={game.id}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    cursor: game.isActive ? 'pointer' : 'not-allowed',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    border: `1px solid ${colors.border}`,
                    opacity: game.isActive ? 1 : 0.5,
                  }}
                  onClick={() => handleGameClick(game.slug, game.isActive)}
                  onMouseEnter={(e) => {
                    if (game.isActive) {
                      e.currentTarget.style.transform = 'translateY(-8px)';
                      e.currentTarget.style.boxShadow = isDark
                        ? '0 20px 40px rgba(102, 126, 234, 0.3)'
                        : '0 20px 40px rgba(99, 102, 241, 0.2)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className={`${styles.gameCardPreview} ${getPreviewClass(game.slug)}`}>
                    <span className={styles.gameIcon}>
                      {gameIcons[game.slug] || <Star24Regular />}
                    </span>
                  </div>
                  <div style={{ padding: '24px' }}>
                    <div style={{
                      color: colors.textPrimary,
                      fontSize: '20px',
                      fontWeight: 'bold',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}>
                      {game.name}
                      {!game.isActive && (
                        <Badge appearance="tint" color="warning" shape="rounded">
                          即将开放
                        </Badge>
                      )}
                    </div>
                    <div style={{ color: colors.textSecondary, fontSize: '14px' }}>
                      {game.isActive ? '点击浏览并下载游戏素材资源' : '敬请期待，即将上线'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section style={{ marginTop: '40px' }}>
          <div style={{
            color: colors.textPrimary,
            marginBottom: '32px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: colors.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <MusicNote224Regular />
            </div>
            <Title2 style={{ color: colors.textPrimary, margin: 0 }}>功能特色</Title2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '24px',
          }}>
            {[
              { icon: <MusicNote224Regular />, title: '🎵 音乐素材', desc: '角色语音、背景音乐、战斗音效等高品质音频资源，支持在线试听' },
              { icon: <Image24Regular />, title: '🎨 图片素材', desc: '角色立绘、场景原画、UI界面资源，提供多种分辨率下载' },
              { icon: <ArrowDownload24Regular />, title: '📁 免费下载', desc: '所有素材完全免费提供下载，无需注册即可使用' },
            ].map((feature, index) => (
              <div
                key={index}
                style={{
                  backgroundColor: colors.cardBg,
                  borderRadius: '16px',
                  padding: '32px',
                  border: `1px solid ${colors.border}`,
                  textAlign: 'center',
                  transition: 'transform 0.3s, border-color 0.3s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = isDark ? 'rgba(102, 126, 234, 0.5)' : 'rgba(99, 102, 241, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = colors.border;
                }}
              >
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '16px',
                  background: colors.gradientSecondary,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 20px',
                  fontSize: '28px',
                  color: isDark ? '#667eea' : '#6366f1',
                }}>
                  {feature.icon}
                </div>
                <div style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: 'bold', marginBottom: '12px' }}>
                  {feature.title}
                </div>
                <div style={{ color: colors.textSecondary, fontSize: '14px', lineHeight: '1.6' }}>
                  {feature.desc}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Materials Section */}
        {popularMaterials.length > 0 && (
          <section style={{ marginTop: '60px' }}>
            <div style={{
              color: colors.textPrimary,
              marginBottom: '32px',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: colors.gradientPrimary,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
              }}>
                <ArrowDownload24Regular />
              </div>
              <Title2 style={{ color: colors.textPrimary, margin: 0 }}>热门下载</Title2>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
            }}>
              {popularMaterials.map((material) => (
                <div
                  key={material.id}
                  style={{
                    backgroundColor: colors.cardBg,
                    borderRadius: '12px',
                    overflow: 'hidden',
                    border: `1px solid ${colors.border}`,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                  onClick={() => navigate(`/material/${material.id}`)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = isDark
                      ? '0 8px 24px rgba(102, 126, 234, 0.2)'
                      : '0 8px 24px rgba(99, 102, 241, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{
                    height: '120px',
                    background: colors.gradientSecondary,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    overflow: 'hidden',
                  }}>
                    {material.fileType.startsWith('image/') ? (
                      <img
                        src={material.filePath}
                        alt={material.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <MusicNote224Regular style={{ fontSize: '40px', color: isDark ? '#667eea' : '#6366f1' }} />
                    )}
                    <Badge
                      appearance="filled"
                      color="brand"
                      shape="rounded"
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                      }}
                    >
                      {material.game?.name}
                    </Badge>
                  </div>
                  <div style={{ padding: '12px 16px' }}>
                    <div style={{
                      color: colors.textPrimary,
                      fontSize: '14px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}>
                      {material.title}
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      color: colors.textMuted,
                      fontSize: '12px',
                    }}>
                      <span>{material.category?.name}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <ArrowDownload24Regular style={{ fontSize: 12 }} />
                        {material.downloadCount}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer style={{
        backgroundColor: colors.footerBg,
        padding: '32px 48px',
        textAlign: 'center',
        borderTop: `1px solid ${colors.border}`,
      }}>
        <p style={{ color: colors.textMuted, fontSize: '14px' }}>
          HOYODB ©{new Date().getFullYear()} | 仅供学习交流使用，素材版权归米哈游所有
        </p>
      </footer>
    </div>
  );
};

export default HomePage;

