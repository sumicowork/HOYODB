import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Button,
  Input,
  Spinner,
  Text,
  Badge,
  makeStyles,
  shorthands,
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
  Filter24Regular,
} from '@fluentui/react-icons';
import { api, Game, Material, Category } from '../services/api';
import ThemeToggle from '../components/ThemeToggle';
import MobileMenu from '../components/MobileMenu';
import SearchFilter from '../components/SearchFilter';
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
  mobileMenuButton: {
    display: 'none',
    color: 'white',
    '@media (max-width: 768px)': {
      display: 'flex',
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
  const { colors, isDark } = useTheme();
  const { gameSlug } = useParams<{ gameSlug: string }>();
  const navigate = useNavigate();

  const [game, setGame] = useState<Game | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [materialsLoading, setMaterialsLoading] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedTagId, setSelectedTagId] = useState<number | null>(null);
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
  }, [game, selectedCategory, selectedTagId, searchQuery, currentPage]);

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
        tagId: selectedTagId || undefined,
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

  const handleTagFilter = (tagId: number | null) => {
    setSelectedTagId(tagId);
    setCurrentPage(1);
  };

  const handleCategoryClick = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(totalMaterials / pageSize);

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

  if (!game) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
        <div className={styles.spinnerContainer}>
          <Text style={{ color: colors.textPrimary, fontSize: '24px', marginBottom: '16px' }}>游戏不存在</Text>
          <Button appearance="primary" onClick={() => navigate('/')}>
            返回首页
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: colors.pageBg }}>
      {/* Header */}
      <header style={{
        background: colors.headerBg,
        padding: '16px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: `0 4px 20px ${colors.shadow}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile Menu */}
          <MobileMenu title="素材分类" className={styles.mobileMenuButton}>
            <Button
              appearance="subtle"
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '4px',
                color: selectedCategory === null ? 'white' : colors.textSecondary,
                backgroundColor: selectedCategory === null ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
              }}
              onClick={() => handleCategoryClick(null)}
            >
              全部素材
            </Button>
            {categories.map((cat) => (
              <Button
                key={cat.id}
                appearance="subtle"
                style={{
                  justifyContent: 'flex-start',
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  marginBottom: '4px',
                  color: selectedCategory === cat.id ? 'white' : colors.textSecondary,
                  backgroundColor: selectedCategory === cat.id ? 'rgba(102, 126, 234, 0.3)' : 'transparent',
                }}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </Button>
            ))}
          </MobileMenu>
          <div style={{ color: 'white', cursor: 'pointer', fontWeight: 'bold', fontSize: '24px' }} onClick={() => navigate('/')}>
            HOYODB
          </div>
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

      {/* Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)' }}>
        {/* Sidebar */}
        <aside style={{
          width: '280px',
          backgroundColor: colors.sidebarBg,
          borderRight: `1px solid ${colors.border}`,
          padding: '24px 16px',
          position: 'sticky',
          top: '64px',
          height: 'calc(100vh - 64px)',
          overflowY: 'auto',
        }} className="responsive-sidebar">
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            padding: '0 8px',
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: colors.gradientPrimary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <Filter24Regular />
            </div>
            <div style={{ color: colors.textPrimary, fontSize: '18px', fontWeight: 'bold' }}>素材分类</div>
          </div>

          <Button
            appearance="subtle"
            style={{
              justifyContent: 'flex-start',
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '4px',
              color: selectedCategory === null ? 'white' : colors.textSecondary,
              backgroundColor: selectedCategory === null
                ? (isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(99, 102, 241, 0.2)')
                : 'transparent',
              border: selectedCategory === null
                ? (isDark ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(99, 102, 241, 0.3)')
                : 'none',
            }}
            onClick={() => handleCategoryClick(null)}
          >
            全部素材
            <span style={{
              marginLeft: 'auto',
              backgroundColor: colors.buttonBg,
              padding: '2px 8px',
              borderRadius: '10px',
              fontSize: '12px',
            }}>{totalMaterials}</span>
          </Button>

          {categories.map((cat) => (
            <Button
              key={cat.id}
              appearance="subtle"
              style={{
                justifyContent: 'flex-start',
                width: '100%',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '4px',
                color: selectedCategory === cat.id ? 'white' : colors.textSecondary,
                backgroundColor: selectedCategory === cat.id
                  ? (isDark ? 'rgba(102, 126, 234, 0.3)' : 'rgba(99, 102, 241, 0.2)')
                  : 'transparent',
                border: selectedCategory === cat.id
                  ? (isDark ? '1px solid rgba(102, 126, 234, 0.5)' : '1px solid rgba(99, 102, 241, 0.3)')
                  : 'none',
              }}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </Button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flexGrow: 1, padding: '32px' }}>
          {/* Breadcrumb */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            fontSize: '14px',
          }}>
            <span
              style={{ color: colors.textSecondary, cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              onClick={() => navigate('/')}
            >
              <Home24Regular style={{ fontSize: 16, marginRight: 4 }} />
              首页
            </span>
            <span style={{ color: colors.textMuted }}>/</span>
            <span style={{ color: colors.textPrimary }}>{game.name}</span>
            {selectedCategory && (
              <>
                <span style={{ color: colors.textMuted }}>/</span>
                <span style={{ color: colors.textPrimary }}>
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
              </>
            )}
          </div>

          {/* Title Section */}
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ color: colors.textPrimary, fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>{game.name}</h1>
            <p style={{ color: colors.textSecondary, fontSize: '14px' }}>
              共 {totalMaterials} 个素材
              {selectedCategory && ` · ${categories.find((c) => c.id === selectedCategory)?.name}`}
            </p>
          </div>

          {/* Search and Filter */}
          <div style={{ marginBottom: '32px' }}>
            <SearchFilter
              gameId={game.id}
              onSearch={handleSearch}
              onTagFilter={handleTagFilter}
              selectedTagId={selectedTagId}
              searchQuery={searchQuery}
            />
          </div>

          {/* Materials Grid */}
          {materialsLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '100px', flexDirection: 'column', gap: '16px' }}>
              <Spinner size="large" />
              <Text style={{ color: colors.textSecondary }}>加载素材...</Text>
            </div>
          ) : materials.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '80px 40px',
              backgroundColor: colors.buttonBg,
              borderRadius: '16px',
              border: `1px dashed ${colors.border}`,
            }}>
              <div style={{ fontSize: '64px', color: colors.textMuted, marginBottom: '16px' }}>
                <Document24Regular />
              </div>
              <div style={{ color: colors.textPrimary, fontSize: '18px', marginBottom: '8px' }}>暂无素材</div>
              <div style={{ color: colors.textSecondary, fontSize: '14px' }}>该分类下还没有上传任何素材</div>
            </div>
          ) : (
            <>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px',
              }}>
                {materials.map((material) => (
                  <div
                    key={material.id}
                    style={{
                      backgroundColor: colors.cardBg,
                      borderRadius: '16px',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      border: `1px solid ${colors.border}`,
                    }}
                    onClick={() => navigate(`/material/${material.id}`)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = isDark
                        ? '0 12px 24px rgba(102, 126, 234, 0.2)'
                        : '0 12px 24px rgba(99, 102, 241, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={{
                      height: '160px',
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
                        <span style={{ fontSize: '48px', color: isDark ? '#667eea' : '#6366f1' }}>
                          {getFileIcon(material.fileType)}
                        </span>
                      )}
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: colors.gradientPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: '16px',
                      }}>
                        {getFileIcon(material.fileType)}
                      </div>
                    </div>
                    <div style={{ padding: '16px' }}>
                      <div style={{
                        color: colors.textPrimary,
                        fontSize: '15px',
                        fontWeight: '600',
                        marginBottom: '12px',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}>{material.title}</div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Badge appearance="tint" color="brand" shape="rounded">
                          {material.category?.name}
                        </Badge>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: colors.textMuted, fontSize: '12px' }}>
                          <span>{formatFileSize(material.fileSize)}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
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
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '16px',
                  marginTop: '40px',
                  padding: '20px',
                  backgroundColor: colors.cardBg,
                  borderRadius: '12px',
                }}>
                  <Button
                    appearance="subtle"
                    icon={<ArrowLeft24Regular />}
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.buttonBg,
                      border: `1px solid ${colors.border}`,
                    }}
                  >
                    上一页
                  </Button>
                  <span style={{ color: colors.textSecondary, fontSize: '14px' }}>
                    第 {currentPage} 页 / 共 {totalPages} 页
                  </span>
                  <Button
                    appearance="subtle"
                    icon={<ArrowRight24Regular />}
                    iconPosition="after"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    style={{
                      color: colors.textPrimary,
                      backgroundColor: colors.buttonBg,
                      border: `1px solid ${colors.border}`,
                    }}
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
      <footer style={{
        backgroundColor: colors.footerBg,
        padding: '24px 32px',
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

export default GamePage;

