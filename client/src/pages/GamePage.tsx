import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardPreview,
  Button,
  Input,
  Spinner,
  Text,
  Title2,
  Title3,
  Badge,
  makeStyles,
  shorthands,
  tokens,
} from '@fluentui/react-components';
import {
  Home24Regular,
  Search24Regular,
  MusicNote224Regular,
  Image24Regular,
  Document24Regular,
  ArrowDownload24Regular,
  ArrowLeft24Regular,
  ArrowRight24Regular,
  Grid24Regular,
  List24Regular,
  Filter24Regular,
} from '@fluentui/react-icons';
import { api, Game, Material, Category } from '../services/api';

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
    ...shorthands.gap('24px'),
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
  searchBox: {
    flexGrow: 1,
    maxWidth: '500px',
  },
  searchInput: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.2)'),
    ...shorthands.borderRadius('10px'),
    color: 'white',
    '::placeholder': {
      color: 'rgba(255, 255, 255, 0.5)',
    },
  },
  searchIcon: {
    color: 'rgba(255, 255, 255, 0.6)',
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
  layout: {
    display: 'flex',
    minHeight: 'calc(100vh - 64px)',
  },
  sidebar: {
    width: '280px',
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRight('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    ...shorthands.padding('24px', '16px'),
    position: 'sticky' as const,
    top: '64px',
    height: 'calc(100vh - 64px)',
    overflowY: 'auto' as const,
  },
  sidebarHeader: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    marginBottom: '20px',
    ...shorthands.padding('0', '8px'),
  },
  sidebarIcon: {
    width: '36px',
    height: '36px',
    ...shorthands.borderRadius('10px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  sidebarTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  navItem: {
    justifyContent: 'flex-start',
    width: '100%',
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderRadius('10px'),
    marginBottom: '4px',
    color: 'rgba(255, 255, 255, 0.7)',
    backgroundColor: 'transparent',
    ...shorthands.border('none'),
    transitionProperty: 'all',
    transitionDuration: '0.2s',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
      color: 'white',
    },
  },
  navItemActive: {
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
    color: 'white',
    ...shorthands.border('1px', 'solid', 'rgba(102, 126, 234, 0.5)'),
  },
  navItemCount: {
    marginLeft: 'auto',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.padding('2px', '8px'),
    ...shorthands.borderRadius('10px'),
    fontSize: '12px',
  },
  content: {
    flexGrow: 1,
    ...shorthands.padding('32px'),
  },
  contentHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '24px',
  },
  breadcrumb: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
  },
  breadcrumbLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer',
    ':hover': {
      color: '#667eea',
    },
  },
  breadcrumbSeparator: {
    color: 'rgba(255, 255, 255, 0.3)',
  },
  breadcrumbCurrent: {
    color: 'white',
  },
  titleSection: {
    marginBottom: '32px',
  },
  pageTitle: {
    color: 'white',
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  pageSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  viewToggle: {
    display: 'flex',
    ...shorthands.gap('4px'),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.padding('4px'),
    ...shorthands.borderRadius('8px'),
  },
  viewToggleButton: {
    color: 'rgba(255, 255, 255, 0.5)',
    ':hover': {
      color: 'white',
    },
  },
  viewToggleActive: {
    backgroundColor: 'rgba(102, 126, 234, 0.5)',
    color: 'white',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    ...shorthands.gap('20px'),
  },
  card: {
    backgroundColor: '#1a1a2e',
    ...shorthands.borderRadius('16px'),
    ...shorthands.overflow('hidden'),
    cursor: 'pointer',
    transitionProperty: 'transform, box-shadow, border-color',
    transitionDuration: '0.3s',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    ':hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 40px rgba(102, 126, 234, 0.2)',
      ...shorthands.borderColor('rgba(102, 126, 234, 0.5)'),
    },
  },
  cardPreview: {
    height: '160px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.15) 0%, rgba(118, 75, 162, 0.15) 100%)',
  },
  cardPreviewImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  },
  cardPreviewIcon: {
    fontSize: '48px',
    color: 'rgba(102, 126, 234, 0.8)',
  },
  cardTypeIcon: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    width: '32px',
    height: '32px',
    ...shorthands.borderRadius('8px'),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(10px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
  },
  cardContent: {
    ...shorthands.padding('16px'),
  },
  cardTitle: {
    color: 'white',
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '8px',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    ...shorthands.overflow('hidden'),
    textOverflow: 'ellipsis',
    lineHeight: '1.4',
    height: '44px',
  },
  cardMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '12px',
  },
  cardCategory: {
    fontSize: '12px',
  },
  cardStats: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '13px',
  },
  cardStat: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    marginTop: '40px',
    ...shorthands.padding('24px'),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    ...shorthands.borderRadius('12px'),
  },
  paginationInfo: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
  },
  paginationButton: {
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.2)'),
    ':hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.3)',
      ...shorthands.borderColor('rgba(102, 126, 234, 0.5)'),
    },
    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.padding('100px'),
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('80px', '40px'),
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    ...shorthands.borderRadius('16px'),
    ...shorthands.border('1px', 'dashed', 'rgba(255, 255, 255, 0.2)'),
  },
  emptyIcon: {
    fontSize: '64px',
    color: 'rgba(255, 255, 255, 0.2)',
    marginBottom: '16px',
  },
  emptyTitle: {
    color: 'white',
    fontSize: '18px',
    marginBottom: '8px',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '14px',
  },
  footer: {
    backgroundColor: '#0a0a14',
    ...shorthands.padding('24px', '32px'),
    textAlign: 'center',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
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

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith('audio/')) return <MusicNote224Regular />;
  if (fileType.startsWith('image/')) return <Image24Regular />;
  return <Document24Regular />;
};

const GamePage: React.FC = () => {
  const styles = useStyles();
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalMaterials, setTotalMaterials] = useState(0);
  const pageSize = 12;

  useEffect(() => {
    loadGameData();
  }, [gameSlug]);

  useEffect(() => {
    if (game) {
      loadMaterials();
    }
  }, [game, selectedCategory, searchQuery, currentPage]);

  const loadGameData = async () => {
    if (!gameSlug) return;

    setLoading(true);
    try {
      const response = await api.getGame(gameSlug);
      const gameData = response.data.data as Game & { categories: Category[] };
      setGame(gameData);
      setCategories(gameData.categories || []);
    } catch (error) {
      console.error('加载游戏数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMaterials = async () => {
    if (!game) return;

    setMaterialsLoading(true);
    try {
      const response = await api.getMaterials({
        gameId: game.id,
        categoryId: selectedCategory || undefined,
        search: searchQuery || undefined,
        page: currentPage,
        limit: pageSize,
      });
      setMaterials(response.data.data);
      setTotalMaterials(response.data.pagination.total);
    } catch (error) {
      console.error('加载素材列表失败:', error);
    } finally {
      setMaterialsLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalMaterials / pageSize);

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

  if (!game) {
    return (
      <div className={styles.root}>
        <div className={styles.spinnerContainer}>
          <Text style={{ color: 'white', fontSize: '24px', marginBottom: '16px' }}>游戏不存在</Text>
          <Button appearance="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.root}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerTitle} onClick={() => navigate('/')}>
          HOYODB
        </div>
        <div className={styles.searchBox}>
          <Input
            placeholder="搜索素材名称..."
            contentBefore={<Search24Regular className={styles.searchIcon} />}
            value={searchQuery}
            onChange={(e, data) => handleSearch(data.value)}
            className={styles.searchInput}
            size="large"
          />
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

      {/* Layout */}
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarHeader}>
            <div className={styles.sidebarIcon}>
              <Filter24Regular />
            </div>
            <div className={styles.sidebarTitle}>素材分类</div>
          </div>

          <Button
            appearance="subtle"
            className={`${styles.navItem} ${selectedCategory === null ? styles.navItemActive : ''}`}
            onClick={() => handleCategoryClick(null)}
          >
            全部素材
            <span className={styles.navItemCount}>{totalMaterials}</span>
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat.id}
              appearance="subtle"
              className={`${styles.navItem} ${selectedCategory === cat.id ? styles.navItemActive : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </aside>

        {/* Content */}
        <main className={styles.content}>
          {/* Breadcrumb */}
          <div className={styles.breadcrumb}>
            <span className={styles.breadcrumbLink} onClick={() => navigate('/')}>
              <Home24Regular style={{ fontSize: 16, marginRight: 4 }} />
              首页
            </span>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>{game.name}</span>
            {selectedCategory && (
              <>
                <span className={styles.breadcrumbSeparator}>/</span>
                <span className={styles.breadcrumbCurrent}>
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>

          {/* Title Section */}
          <div className={styles.titleSection}>
            <h1 className={styles.pageTitle}>{game.name}</h1>
            <p className={styles.pageSubtitle}>
              共 {totalMaterials} 个素材
              {selectedCategory && ` · ${categories.find((c) => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Materials Grid */}
          {materialsLoading ? (
            <div className={styles.spinnerContainer}>
              <Spinner size="large" />
              <Text style={{ color: 'rgba(255, 255, 255, 0.6)' }}>加载素材...</Text>
            </div>
          ) : materials.length === 0 ? (
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>
                <Document24Regular />
              </div>
              <div className={styles.emptyTitle}>暂无素材</div>
              <div className={styles.emptyText}>该分类下还没有上传任何素材</div>
            </div>
          ) : (
            <>
              <div className={styles.grid}>
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className={styles.card}
                    onClick={() => navigate(`/material/${material.id}`)}
                  >
                    <div className={styles.cardPreview}>
                      {material.fileType.startsWith('image/') ? (
                        <img
                          src={material.filePath}
                          alt={material.title}
                          className={styles.cardPreviewImage}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <span className={styles.cardPreviewIcon}>
                          {getFileIcon(material.fileType)}
                        </span>
                      )}
                      <div className={styles.cardTypeIcon}>
                        {getFileIcon(material.fileType)}
                      </div>
                    </div>
                    <div className={styles.cardContent}>
                      <div className={styles.cardTitle}>{material.title}</div>
                      <div className={styles.cardMeta}>
                        <Badge appearance="tint" color="brand" shape="rounded" className={styles.cardCategory}>
                          {material.category?.name}
                        </Badge>
                        <div className={styles.cardStats}>
                          <span className={styles.cardStat}>
                            {formatFileSize(material.fileSize)}
                          </span>
                          <span className={styles.cardStat}>
                            <ArrowDownload24Regular style={{ fontSize: 14 }} />
                            {material.downloadCount}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className={styles.pagination}>
                  <Button
                    appearance="subtle"
                    icon={<ArrowLeft24Regular />}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={styles.paginationButton}
                  >
                    上一页
                  </Button>
                  <span className={styles.paginationInfo}>
                    第 {currentPage} 页 / 共 {totalPages} 页
                  </span>
                  <Button
                    appearance="subtle"
                    icon={<ArrowRight24Regular />}
                    iconPosition="after"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={styles.paginationButton}
                  >
                    下一页
                  </Button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className={styles.footer}>
        <p className={styles.footerText}>
          HOYODB ©{new Date().getFullYear()} | 仅供学习交流使用，素材版权归米哈游所有
        </p>
      </footer>
    </div>
  );
};

export default GamePage;

