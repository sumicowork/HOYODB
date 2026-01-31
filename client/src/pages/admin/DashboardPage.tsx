import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Title3,
  Text,
  Spinner,
  makeStyles,
  shorthands,
  tokens,
  Table,
  TableHeader,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
  Divider,
} from '@fluentui/react-components';
import {
  Document24Regular,
  ArrowDownload24Regular,
  Apps24Regular,
  Grid24Regular,
  ChartMultiple24Regular,
  ArrowRight16Regular,
} from '@fluentui/react-icons';
import AdminLayout from '../../components/AdminLayout';
import { adminApi, Material } from '../../services/api';

const useStyles = makeStyles({
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    ...shorthands.gap('20px'),
    marginBottom: '32px',
  },
  statCard: {
    ...shorthands.padding('24px'),
    background: `linear-gradient(135deg, ${tokens.colorNeutralBackground1} 0%, ${tokens.colorNeutralBackground3} 100%)`,
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow4,
    transitionProperty: 'transform, box-shadow',
    transitionDuration: '0.2s',
    ':hover': {
      transform: 'translateY(-2px)',
      boxShadow: tokens.shadow8,
    },
  },
  statCardPrimary: {
    background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
  },
  statCardSuccess: {
    background: `linear-gradient(135deg, #11998e 0%, #38ef7d 100%)`,
  },
  statCardWarning: {
    background: `linear-gradient(135deg, #f093fb 0%, #f5576c 100%)`,
  },
  statCardInfo: {
    background: `linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)`,
  },
  statHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  },
  statIconWrapper: {
    width: '48px',
    height: '48px',
    ...shorthands.borderRadius('12px'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIcon: {
    fontSize: '24px',
    color: 'white',
  },
  statValue: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 1,
    marginBottom: '4px',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: '14px',
  },
  tablesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
    ...shorthands.gap('24px'),
  },
  tableCard: {
    ...shorthands.padding('0'),
    ...shorthands.borderRadius('12px'),
    boxShadow: tokens.shadow4,
    ...shorthands.overflow('hidden'),
  },
  tableHeader: {
    ...shorthands.padding('20px', '24px'),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
  },
  tableTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  tableTitleIcon: {
    width: '36px',
    height: '36px',
    ...shorthands.borderRadius('8px'),
    backgroundColor: tokens.colorBrandBackground2,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: tokens.colorBrandForeground1,
  },
  tableContent: {
    ...shorthands.padding('8px', '16px', '16px'),
  },
  tableRow: {
    ...shorthands.borderRadius('8px'),
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('40px'),
    color: tokens.colorNeutralForeground3,
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '400px',
  },
  viewAllButton: {
    fontSize: '12px',
  },
});

interface DashboardStats {
  stats: {
    totalMaterials: number;
    totalDownloads: number;
    totalGames: number;
    totalCategories: number;
  };
  recentMaterials: Material[];
  popularMaterials: Material[];
}

const AdminDashboard: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await adminApi.getDashboardStats();
      setData(response.data.data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/admin/login');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="仪表盘">
        <div className={styles.spinnerContainer}>
          <Spinner size="large" label="加载中..." />
        </div>
      </AdminLayout>
    );
  }

  const statCards = [
    {
      icon: <Document24Regular />,
      value: data?.stats.totalMaterials || 0,
      label: '素材总数',
      style: styles.statCardPrimary,
    },
    {
      icon: <ArrowDownload24Regular />,
      value: data?.stats.totalDownloads || 0,
      label: '总下载量',
      style: styles.statCardSuccess,
    },
    {
      icon: <Apps24Regular />,
      value: data?.stats.totalGames || 0,
      label: '游戏数量',
      style: styles.statCardWarning,
    },
    {
      icon: <Grid24Regular />,
      value: data?.stats.totalCategories || 0,
      label: '分类数量',
      style: styles.statCardInfo,
    },
  ];

  return (
    <AdminLayout title="仪表盘">
      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        {statCards.map((stat, index) => (
          <Card key={index} className={`${styles.statCard} ${stat.style}`}>
            <div className={styles.statHeader}>
              <div>
                <div className={styles.statValue}>{stat.value}</div>
                <Text className={styles.statLabel}>{stat.label}</Text>
              </div>
              <div className={styles.statIconWrapper}>
                <span className={styles.statIcon}>{stat.icon}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Tables */}
      <div className={styles.tablesGrid}>
        {/* Recent Materials */}
        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <div className={styles.tableTitleIcon}>
                <Document24Regular />
              </div>
              <Title3>最近上传</Title3>
            </div>
            <Button
              appearance="subtle"
              size="small"
              icon={<ArrowRight16Regular />}
              iconPosition="after"
              className={styles.viewAllButton}
              onClick={() => navigate('/admin/materials')}
            >
              查看全部
            </Button>
          </div>
          <div className={styles.tableContent}>
            {data?.recentMaterials && data.recentMaterials.length > 0 ? (
              <Table size="small">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>标题</TableHeaderCell>
                    <TableHeaderCell>游戏</TableHeaderCell>
                    <TableHeaderCell>时间</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.recentMaterials.map((material) => (
                    <TableRow key={material.id} className={styles.tableRow}>
                      <TableCell>
                        <Text truncate style={{ maxWidth: 180 }}>{material.title}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge appearance="tint" color="brand" shape="rounded">
                          {material.game?.name}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text size={200} style={{ color: tokens.colorNeutralForeground3 }}>
                          {new Date(material.uploadTime).toLocaleDateString('zh-CN')}
                        </Text>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className={styles.emptyState}>
                <Text>暂无数据</Text>
              </div>
            )}
          </div>
        </Card>

        {/* Popular Materials */}
        <Card className={styles.tableCard}>
          <div className={styles.tableHeader}>
            <div className={styles.tableTitle}>
              <div className={styles.tableTitleIcon}>
                <ChartMultiple24Regular />
              </div>
              <Title3>热门素材</Title3>
            </div>
            <Button
              appearance="subtle"
              size="small"
              icon={<ArrowRight16Regular />}
              iconPosition="after"
              className={styles.viewAllButton}
              onClick={() => navigate('/admin/materials')}
            >
              查看全部
            </Button>
          </div>
          <div className={styles.tableContent}>
            {data?.popularMaterials && data.popularMaterials.length > 0 ? (
              <Table size="small">
                <TableHeader>
                  <TableRow>
                    <TableHeaderCell>排名</TableHeaderCell>
                    <TableHeaderCell>标题</TableHeaderCell>
                    <TableHeaderCell>下载次数</TableHeaderCell>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.popularMaterials.map((material, index) => (
                    <TableRow key={material.id} className={styles.tableRow}>
                      <TableCell>
                        <Badge
                          appearance="filled"
                          color={index < 3 ? 'danger' : 'subtle'}
                          shape="circular"
                        >
                          {index + 1}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Text truncate style={{ maxWidth: 200 }}>{material.title}</Text>
                      </TableCell>
                      <TableCell>
                        <Badge appearance="outline" color="success">
                          <ArrowDownload24Regular style={{ fontSize: 12, marginRight: 4 }} />
                          {material.downloadCount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className={styles.emptyState}>
                <Text>暂无数据</Text>
              </div>
            )}
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;

