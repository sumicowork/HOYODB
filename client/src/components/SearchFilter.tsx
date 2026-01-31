import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Dropdown,
  Option,
  Badge,
  makeStyles,
  shorthands,
  Popover,
  PopoverTrigger,
  PopoverSurface,
} from '@fluentui/react-components';
import {
  Search24Regular,
  Filter24Regular,
  Dismiss24Regular,
  Checkmark24Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';
import { Tag, api } from '../services/api';

interface SearchFilterProps {
  gameId?: number;
  onSearch: (query: string) => void;
  onTagFilter: (tagId: number | null) => void;
  selectedTagId: number | null;
  searchQuery: string;
}

const useStyles = makeStyles({
  container: {
    display: 'flex',
    ...shorthands.gap('12px'),
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  searchInput: {
    minWidth: '280px',
    flexGrow: 1,
  },
  filterButton: {
    position: 'relative',
  },
  filterBadge: {
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    width: '8px',
    height: '8px',
    ...shorthands.borderRadius('50%'),
    backgroundColor: '#ef4444',
  },
  popoverContent: {
    ...shorthands.padding('16px'),
    minWidth: '300px',
    maxWidth: '400px',
  },
  popoverTitle: {
    fontSize: '16px',
    fontWeight: '600',
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tagSection: {
    marginBottom: '16px',
  },
  tagSectionTitle: {
    fontSize: '12px',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: '8px',
    opacity: 0.6,
  },
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    ...shorthands.gap('8px'),
  },
  tagChip: {
    cursor: 'pointer',
    transitionProperty: 'all',
    transitionDuration: '0.2s',
  },
  tagChipSelected: {
    boxShadow: '0 0 0 2px currentColor',
  },
  clearButton: {
    marginTop: '16px',
    width: '100%',
  },
  activeFilters: {
    display: 'flex',
    ...shorthands.gap('8px'),
    flexWrap: 'wrap',
    marginTop: '8px',
  },
  activeFilterChip: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('4px'),
    cursor: 'pointer',
  },
});

const SearchFilter: React.FC<SearchFilterProps> = ({
  gameId,
  onSearch,
  onTagFilter,
  selectedTagId,
  searchQuery,
}) => {
  const styles = useStyles();
  const { colors, isDark } = useTheme();
  const [tags, setTags] = useState<Tag[]>([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState(searchQuery);

  useEffect(() => {
    loadTags();
  }, []);

  useEffect(() => {
    setLocalSearch(searchQuery);
  }, [searchQuery]);

  const loadTags = async () => {
    try {
      const response = await api.getTags();
      setTags(response.data.data);
    } catch (error) {
      console.error('加载标签失败:', error);
    }
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSearch(localSearch);
    }
  };

  const handleTagClick = (tagId: number) => {
    if (selectedTagId === tagId) {
      onTagFilter(null);
    } else {
      onTagFilter(tagId);
    }
    setIsPopoverOpen(false);
  };

  const clearFilters = () => {
    onTagFilter(null);
    setIsPopoverOpen(false);
  };

  const selectedTag = tags.find(t => t.id === selectedTagId);
  const hasActiveFilters = selectedTagId !== null;

  // Group tags by type
  const tagsByType = tags.reduce((acc, tag) => {
    if (!acc[tag.type]) {
      acc[tag.type] = [];
    }
    acc[tag.type].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  const typeLabels: Record<string, string> = {
    CHARACTER: '角色',
    ELEMENT: '元素',
    RARITY: '稀有度',
    VERSION: '版本',
    SCENE: '场景',
    OTHER: '其他',
  };

  return (
    <div>
      <div className={styles.container}>
        {/* Search Input */}
        <Input
          placeholder="搜索素材名称或描述..."
          contentBefore={<Search24Regular />}
          value={localSearch}
          onChange={(e, data) => setLocalSearch(data.value)}
          onKeyDown={handleSearchKeyDown}
          className={styles.searchInput}
          style={{
            backgroundColor: colors.cardBg,
            border: `1px solid ${colors.border}`,
          }}
        />

        {/* Search Button */}
        <Button
          appearance="primary"
          icon={<Search24Regular />}
          onClick={() => onSearch(localSearch)}
        >
          搜索
        </Button>

        {/* Filter Popover */}
        <Popover
          open={isPopoverOpen}
          onOpenChange={(e, data) => setIsPopoverOpen(data.open)}
        >
          <PopoverTrigger disableButtonEnhancement>
            <div className={styles.filterButton}>
              <Button
                appearance="subtle"
                icon={<Filter24Regular />}
                style={{
                  backgroundColor: hasActiveFilters
                    ? (isDark ? 'rgba(102, 126, 234, 0.2)' : 'rgba(99, 102, 241, 0.1)')
                    : colors.buttonBg,
                  border: `1px solid ${hasActiveFilters 
                    ? (isDark ? 'rgba(102, 126, 234, 0.5)' : 'rgba(99, 102, 241, 0.3)')
                    : colors.border}`,
                }}
              >
                筛选
              </Button>
              {hasActiveFilters && <div className={styles.filterBadge} />}
            </div>
          </PopoverTrigger>
          <PopoverSurface style={{ backgroundColor: colors.cardBg }}>
            <div className={styles.popoverContent}>
              <div className={styles.popoverTitle}>
                <span style={{ color: colors.textPrimary }}>标签筛选</span>
                {hasActiveFilters && (
                  <Button
                    appearance="subtle"
                    size="small"
                    icon={<Dismiss24Regular />}
                    onClick={clearFilters}
                  >
                    清除
                  </Button>
                )}
              </div>

              {Object.entries(tagsByType).map(([type, typeTags]) => (
                <div key={type} className={styles.tagSection}>
                  <div className={styles.tagSectionTitle} style={{ color: colors.textMuted }}>
                    {typeLabels[type] || type}
                  </div>
                  <div className={styles.tagGrid}>
                    {typeTags.map((tag) => (
                      <Badge
                        key={tag.id}
                        appearance={selectedTagId === tag.id ? 'filled' : 'outline'}
                        color={selectedTagId === tag.id ? 'brand' : 'informative'}
                        shape="rounded"
                        className={`${styles.tagChip} ${selectedTagId === tag.id ? styles.tagChipSelected : ''}`}
                        onClick={() => handleTagClick(tag.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {tag.name}
                        {selectedTagId === tag.id && (
                          <Checkmark24Regular style={{ fontSize: 12, marginLeft: 4 }} />
                        )}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}

              {hasActiveFilters && (
                <Button
                  appearance="subtle"
                  className={styles.clearButton}
                  onClick={clearFilters}
                  style={{
                    backgroundColor: colors.buttonBg,
                    border: `1px solid ${colors.border}`,
                  }}
                >
                  清除所有筛选
                </Button>
              )}
            </div>
          </PopoverSurface>
        </Popover>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className={styles.activeFilters}>
          {selectedTag && (
            <Badge
              appearance="tint"
              color="brand"
              shape="rounded"
              className={styles.activeFilterChip}
              onClick={() => onTagFilter(null)}
            >
              {selectedTag.name}
              <Dismiss24Regular style={{ fontSize: 12 }} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;

