import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Input,
  Select,
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
  Dialog,
  DialogSurface,
  DialogTitle,
  DialogBody,
  DialogActions,
  DialogContent,
  Field,
  Textarea,
  Text,
  Tooltip,
  MessageBar,
  MessageBarBody,
  Title3,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Edit24Regular,
  Delete24Regular,
  Search24Regular,
  Filter24Regular,
  ArrowLeft24Regular,
  ArrowRight24Regular,
} from '@fluentui/react-icons';
import AdminLayout from '../../components/AdminLayout';
import { adminApi, Material, Game, Category, Tag } from '../../services/api';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  filters: {
    display: 'flex',
    ...shorthands.gap('12px'),
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  filterIcon: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
    color: tokens.colorNeutralForeground3,
    fontSize: '14px',
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
  tableContent: {
    ...shorthands.padding('0'),
  },
  tableRow: {
    ':hover': {
      backgroundColor: tokens.colorNeutralBackground1Hover,
    },
  },
  pagination: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.gap('16px'),
    ...shorthands.padding('20px'),
    ...shorthands.borderTop('1px', 'solid', tokens.colorNeutralStroke1),
    backgroundColor: tokens.colorNeutralBackground1,
  },
  paginationInfo: {
    color: tokens.colorNeutralForeground3,
    fontSize: '14px',
  },
  actions: {
    display: 'flex',
    ...shorthands.gap('4px'),
  },
  actionButton: {
    minWidth: 'auto',
    ...shorthands.padding('6px'),
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    ...shorthands.gap('16px'),
  },
  formFullWidth: {
    gridColumn: 'span 2',
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('60px'),
  },
  emptyState: {
    textAlign: 'center',
    ...shorthands.padding('60px'),
    color: tokens.colorNeutralForeground3,
  },
  addButton: {
    ...shorthands.padding('10px', '20px'),
    fontWeight: '600',
  },
  searchInput: {
    minWidth: '280px',
  },
  selectFilter: {
    minWidth: '150px',
  },
  dialogSurface: {
    maxWidth: '640px',
    width: '100%',
  },
  statusBadge: {
    fontWeight: '500',
  },
});

const MaterialsManagePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [materials, setMaterials] = useState<Material[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });

  const [filterGameId, setFilterGameId] = useState<string>('');
  const [filterCategoryId, setFilterCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [formData, setFormData] = useState({
    gameId: '',
    categoryId: '',
    title: '',
    description: '',
    filePath: '',
    fileSize: '',
    fileType: '',
    duration: '',
    resolution: '',
    version: '',
    status: 'PUBLISHED',
    tagIds: [] as string[],
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    loadMaterials();
  }, [pagination.current, filterGameId, filterCategoryId, searchQuery]);

  const loadInitialData = async () => {
    try {
      const [gamesRes, tagsRes] = await Promise.all([
        adminApi.getGames(),
        adminApi.getTags(),
      ]);
      setGames(gamesRes.data.data);
      setTags(tagsRes.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: '加载数据失败' });
    }
  };

  const loadMaterials = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getMaterials({
        page: pagination.current,
        limit: pagination.pageSize,
        gameId: filterGameId ? parseInt(filterGameId) : undefined,
        categoryId: filterCategoryId ? parseInt(filterCategoryId) : undefined,
        search: searchQuery || undefined,
      });
      setMaterials(response.data.data);
      setPagination((prev) => ({ ...prev, total: response.data.pagination.total }));
    } catch (error) {
      setMessage({ type: 'error', text: '加载素材列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async (gameId: number) => {
    try {
      const response = await adminApi.getCategories(gameId);
      setCategories(response.data.data);
    } catch (error) {
      console.error('加载分类失败');
    }
  };

  const handleAdd = () => {
    setEditingMaterial(null);
    setFormData({
      gameId: '',
      categoryId: '',
      title: '',
      description: '',
      filePath: '',
      fileSize: '',
      fileType: '',
      duration: '',
      resolution: '',
      version: '',
      status: 'PUBLISHED',
      tagIds: [],
    });
    setDialogOpen(true);
  };

  const handleEdit = (material: Material) => {
    setEditingMaterial(material);
    loadCategories(material.gameId);
    setFormData({
      gameId: String(material.gameId),
      categoryId: String(material.categoryId),
      title: material.title,
      description: material.description || '',
      filePath: material.filePath,
      fileSize: String(material.fileSize),
      fileType: material.fileType,
      duration: material.duration ? String(material.duration) : '',
      resolution: material.resolution || '',
      version: material.version || '',
      status: material.status,
      tagIds: material.tags?.map((t) => String(t.tag.id)) || [],
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个素材吗？')) return;

    try {
      await adminApi.deleteMaterial(id);
      setMessage({ type: 'success', text: '删除成功' });
      loadMaterials();
    } catch (error) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        gameId: parseInt(formData.gameId),
        categoryId: parseInt(formData.categoryId),
        title: formData.title,
        description: formData.description || undefined,
        filePath: formData.filePath,
        fileSize: formData.fileSize,
        fileType: formData.fileType,
        duration: formData.duration ? parseInt(formData.duration) : undefined,
        resolution: formData.resolution || undefined,
        version: formData.version || undefined,
        status: formData.status,
        tagIds: formData.tagIds.map((id) => parseInt(id)),
      };

      if (editingMaterial) {
        await adminApi.updateMaterial(editingMaterial.id, data);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        await adminApi.createMaterial(data);
        setMessage({ type: 'success', text: '创建成功' });
      }

      setDialogOpen(false);
      loadMaterials();
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  const statusConfig: Record<string, { color: 'success' | 'warning' | 'subtle'; label: string }> = {
    PUBLISHED: { color: 'success', label: '已发布' },
    DRAFT: { color: 'warning', label: '草稿' },
    ARCHIVED: { color: 'subtle', label: '已归档' },
  };

  const totalPages = Math.ceil(pagination.total / pagination.pageSize);

  return (
    <AdminLayout title="素材管理">
      {message.text && (
        <MessageBar
          intent={message.type === 'success' ? 'success' : 'error'}
          style={{ marginBottom: 16, borderRadius: 8 }}
        >
          <MessageBarBody>{message.text}</MessageBarBody>
        </MessageBar>
      )}

      {/* Toolbar */}
      <div className={styles.toolbar}>
        <div className={styles.filters}>
          <div className={styles.filterIcon}>
            <Filter24Regular />
            <span>筛选：</span>
          </div>
          <Select
            value={filterGameId}
            onChange={(e, data) => {
              setFilterGameId(data.value);
              setFilterCategoryId('');
              if (data.value) loadCategories(parseInt(data.value));
            }}
            className={styles.selectFilter}
          >
            <option value="">全部游戏</option>
            {games.map((g) => (
              <option key={g.id} value={g.id}>{g.name}</option>
            ))}
          </Select>

          <Select
            value={filterCategoryId}
            onChange={(e, data) => setFilterCategoryId(data.value)}
            disabled={!filterGameId}
            className={styles.selectFilter}
          >
            <option value="">全部分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Select>

          <Input
            placeholder="搜索素材名称..."
            contentBefore={<Search24Regular />}
            value={searchQuery}
            onChange={(e, data) => setSearchQuery(data.value)}
            className={styles.searchInput}
          />
        </div>

        <Button
          appearance="primary"
          icon={<Add24Regular />}
          onClick={handleAdd}
          className={styles.addButton}
        >
          添加素材
        </Button>
      </div>

      {/* Table */}
      <Card className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <Title3>素材列表</Title3>
          <Text style={{ color: tokens.colorNeutralForeground3 }}>
            共 {pagination.total} 条记录
          </Text>
        </div>

        <div className={styles.tableContent}>
          {loading ? (
            <div className={styles.spinnerContainer}>
              <Spinner size="large" label="加载中..." />
            </div>
          ) : materials.length === 0 ? (
            <div className={styles.emptyState}>
              <Text size={400}>暂无素材数据</Text>
              <Text size={200} style={{ marginTop: 8, display: 'block' }}>
                点击上方按钮添加新素材
              </Text>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHeaderCell style={{ width: 60 }}>ID</TableHeaderCell>
                  <TableHeaderCell>标题</TableHeaderCell>
                  <TableHeaderCell style={{ width: 120 }}>游戏</TableHeaderCell>
                  <TableHeaderCell style={{ width: 100 }}>分类</TableHeaderCell>
                  <TableHeaderCell style={{ width: 90 }}>状态</TableHeaderCell>
                  <TableHeaderCell style={{ width: 80 }}>下载</TableHeaderCell>
                  <TableHeaderCell style={{ width: 100 }}>操作</TableHeaderCell>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id} className={styles.tableRow}>
                    <TableCell>
                      <Badge appearance="outline" shape="rounded">{material.id}</Badge>
                    </TableCell>
                    <TableCell>
                      <Text weight="semibold" truncate style={{ maxWidth: 250 }}>
                        {material.title}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Badge appearance="tint" color="brand" shape="rounded">
                        {material.game?.name}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text size={200}>{material.category?.name}</Text>
                    </TableCell>
                    <TableCell>
                      <Badge
                        appearance="filled"
                        color={statusConfig[material.status]?.color}
                        shape="rounded"
                        className={styles.statusBadge}
                      >
                        {statusConfig[material.status]?.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Text>{material.downloadCount}</Text>
                    </TableCell>
                    <TableCell>
                      <div className={styles.actions}>
                        <Tooltip content="编辑" relationship="label">
                          <Button
                            appearance="subtle"
                            icon={<Edit24Regular />}
                            className={styles.actionButton}
                            onClick={() => handleEdit(material)}
                          />
                        </Tooltip>
                        <Tooltip content="删除" relationship="label">
                          <Button
                            appearance="subtle"
                            icon={<Delete24Regular />}
                            className={styles.actionButton}
                            onClick={() => handleDelete(material.id)}
                          />
                        </Tooltip>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination */}
        {!loading && materials.length > 0 && (
          <div className={styles.pagination}>
            <Button
              appearance="subtle"
              icon={<ArrowLeft24Regular />}
              disabled={pagination.current <= 1}
              onClick={() => setPagination((p) => ({ ...p, current: p.current - 1 }))}
            >
              上一页
            </Button>
            <span className={styles.paginationInfo}>
              第 {pagination.current} 页 / 共 {totalPages} 页
            </span>
            <Button
              appearance="subtle"
              icon={<ArrowRight24Regular />}
              iconPosition="after"
              disabled={pagination.current >= totalPages}
              onClick={() => setPagination((p) => ({ ...p, current: p.current + 1 }))}
            >
              下一页
            </Button>
          </div>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(e, data) => setDialogOpen(data.open)}>
        <DialogSurface className={styles.dialogSurface}>
          <DialogBody>
            <DialogTitle>{editingMaterial ? '编辑素材' : '添加素材'}</DialogTitle>
            <DialogContent>
              <div className={styles.formGrid}>
                <Field label="游戏" required>
                  <Select
                    value={formData.gameId}
                    onChange={(e, data) => {
                      setFormData({ ...formData, gameId: data.value, categoryId: '' });
                      if (data.value) loadCategories(parseInt(data.value));
                    }}
                  >
                    <option value="">选择游戏</option>
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="分类" required>
                  <Select
                    value={formData.categoryId}
                    onChange={(e, data) => setFormData({ ...formData, categoryId: data.value })}
                  >
                    <option value="">选择分类</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="标题" required className={styles.formFullWidth}>
                  <Input
                    value={formData.title}
                    onChange={(e, data) => setFormData({ ...formData, title: data.value })}
                    placeholder="输入素材标题"
                  />
                </Field>

                <Field label="描述" className={styles.formFullWidth}>
                  <Textarea
                    value={formData.description}
                    onChange={(e, data) => setFormData({ ...formData, description: data.value })}
                    rows={3}
                    placeholder="输入素材描述（可选）"
                  />
                </Field>

                <Field label="文件路径" required className={styles.formFullWidth}>
                  <Input
                    value={formData.filePath}
                    onChange={(e, data) => setFormData({ ...formData, filePath: data.value })}
                    placeholder="云盘文件链接"
                  />
                </Field>

                <Field label="文件大小(字节)" required>
                  <Input
                    type="number"
                    value={formData.fileSize}
                    onChange={(e, data) => setFormData({ ...formData, fileSize: data.value })}
                  />
                </Field>

                <Field label="文件类型" required>
                  <Input
                    value={formData.fileType}
                    onChange={(e, data) => setFormData({ ...formData, fileType: data.value })}
                    placeholder="如: audio/mp3"
                  />
                </Field>

                <Field label="时长(秒)">
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={(e, data) => setFormData({ ...formData, duration: data.value })}
                  />
                </Field>

                <Field label="分辨率">
                  <Input
                    value={formData.resolution}
                    onChange={(e, data) => setFormData({ ...formData, resolution: data.value })}
                    placeholder="如: 1920x1080"
                  />
                </Field>

                <Field label="游戏版本">
                  <Input
                    value={formData.version}
                    onChange={(e, data) => setFormData({ ...formData, version: data.value })}
                  />
                </Field>

                <Field label="状态">
                  <Select
                    value={formData.status}
                    onChange={(e, data) => setFormData({ ...formData, status: data.value })}
                  >
                    <option value="PUBLISHED">已发布</option>
                    <option value="DRAFT">草稿</option>
                    <option value="ARCHIVED">已归档</option>
                  </Select>
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDialogOpen(false)}>
                取消
              </Button>
              <Button appearance="primary" onClick={handleSubmit}>
                保存
              </Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </AdminLayout>
  );
};

export default MaterialsManagePage;

