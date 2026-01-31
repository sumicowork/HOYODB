import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardPreview,
  Text,
  Title1,
  Title2,
  Title3,
  Body1,
  Badge,
  Spinner,
  Button,
  makeStyles,
  shorthands,
  tokens,
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
import { api, Game } from '../services/api';

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
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const response = await api.getGames();
      setGames(response.data.data);
    } catch (error) {
      console.error('加载游戏列表失败:', error);
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
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle}>HOYODB</div>
        <div className={styles.headerNav}>
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
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>米哈游游戏素材数据库</h1>
        <p className={styles.heroSubtitle}>
          免费下载米哈游游戏的音乐、立绘、UI素材等资源，为创作者提供高质量素材支持
        </p>
      </section>

      {/* Content */}
      <main className={styles.content}>
        {/* Games Section */}
        <section>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon}>
              <Star24Regular />
            </div>
            <Title2 style={{ color: 'white', margin: 0 }}>选择游戏</Title2>
          </div>

          {loading ? (
            <div className={styles.spinnerContainer}>
              <Spinner size="large" label="加载中..." />
            </div>
          ) : (
            <div className={styles.gamesGrid}>
              {games.map((game) => (
                <div
                  key={game.id}
                  className={`${styles.gameCard} ${!game.isActive ? styles.gameCardDisabled : ''}`}
                  onClick={() => handleGameClick(game.slug, game.isActive)}
                >
                  <div className={`${styles.gameCardPreview} ${getPreviewClass(game.slug)}`}>
                    <span className={styles.gameIcon}>
                      {gameIcons[game.slug] || <Star24Regular />}
                    </span>
                  </div>
                  <div className={styles.gameCardContent}>
                    <div className={styles.gameTitle}>
                      {game.name}
                      {!game.isActive && (
                        <Badge appearance="tint" color="warning" shape="rounded">
                          即将开放
                        </Badge>
                      )}
                    </div>
                    <div className={styles.gameDescription}>
                      {game.isActive ? '点击浏览并下载游戏素材资源' : '敬请期待，即将上线'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.sectionTitle}>
            <div className={styles.sectionTitleIcon}>
              <MusicNote224Regular />
            </div>
            <Title2 style={{ color: 'white', margin: 0 }}>功能特色</Title2>
          </div>

          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <MusicNote224Regular />
              </div>
              <div className={styles.featureTitle}>🎵 音乐素材</div>
              <div className={styles.featureDescription}>
                角色语音、背景音乐、战斗音效等高品质音频资源，支持在线试听
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <Image24Regular />
              </div>
              <div className={styles.featureTitle}>🎨 图片素材</div>
              <div className={styles.featureDescription}>
                角色立绘、场景原画、UI界面资源，提供多种分辨率下载
              </div>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>
                <ArrowDownload24Regular />
              </div>
              <div className={styles.featureTitle}>📁 免费下载</div>
              <div className={styles.featureDescription}>
                所有素材完全免费提供下载，无需注册即可使用
              </div>
            </div>
          </div>
        </section>
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

export default HomePage;

