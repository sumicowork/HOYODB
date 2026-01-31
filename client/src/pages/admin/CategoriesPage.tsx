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
  Text,
  MessageBar,
  MessageBarBody,
  Tooltip,
} from '@fluentui/react-components';
import {
  Add24Regular,
  Edit24Regular,
  Delete24Regular,
} from '@fluentui/react-icons';
import AdminLayout from '../../components/AdminLayout';
import { adminApi, Category, Game } from '../../services/api';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
    flexWrap: 'wrap',
    ...shorthands.gap('16px'),
  },
  filters: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  tableCard: {
    ...shorthands.padding('20px'),
  },
  actions: {
    display: 'flex',
    ...shorthands.gap('4px'),
  },
  spinnerContainer: {
    display: 'flex',
    justifyContent: 'center',
    ...shorthands.padding('40px'),
  },
  formGrid: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('16px'),
  },
});

const CategoriesManagePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterGameId, setFilterGameId] = useState<string>('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    gameId: '',
    name: '',
    slug: '',
    sortOrder: '0',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadGames();
  }, []);

  useEffect(() => {
    loadCategories();
  }, [filterGameId]);

  const loadGames = async () => {
    try {
      const response = await adminApi.getGames();
      setGames(response.data.data);
      if (response.data.data.length > 0) {
        setFilterGameId(String(response.data.data[0].id));
      }
    } catch (error) {
      setMessage({ type: 'error', text: '加载游戏列表失败' });
    }
  };

  const loadCategories = async () => {
    if (!filterGameId) return;
    setLoading(true);
    try {
      const response = await adminApi.getCategories(parseInt(filterGameId));
      setCategories(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: '加载分类列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({
      gameId: filterGameId,
      name: '',
      slug: '',
      sortOrder: '0',
    });
    setDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      gameId: String(category.gameId),
      name: category.name,
      slug: category.slug,
      sortOrder: String(category.sortOrder),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个分类吗？')) return;

    try {
      await adminApi.deleteCategory(id);
      setMessage({ type: 'success', text: '删除成功' });
      loadCategories();
    } catch (error) {
      setMessage({ type: 'error', text: '删除失败，可能有素材关联此分类' });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        gameId: parseInt(formData.gameId),
        name: formData.name,
        slug: formData.slug,
        sortOrder: parseInt(formData.sortOrder),
      };

      if (editingCategory) {
        await adminApi.updateCategory(editingCategory.id, data);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        await adminApi.createCategory(data);
        setMessage({ type: 'success', text: '创建成功' });
      }

      setDialogOpen(false);
      loadCategories();
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  return (
    <AdminLayout title="分类管理">
      {message.text && (
        <MessageBar
          intent={message.type === 'success' ? 'success' : 'error'}
          style={{ marginBottom: 16 }}
        >
          <MessageBarBody>{message.text}</MessageBarBody>
        </MessageBar>
      )}

      <Card className={styles.tableCard}>
        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.filters}>
            <Text>选择游戏：</Text>
            <Select
              value={filterGameId}
              onChange={(e, data) => setFilterGameId(data.value)}
              style={{ minWidth: 200 }}
            >
              {games.map((g) => (
                <option key={g.id} value={g.id}>{g.name}</option>
              ))}
            </Select>
          </div>

          <Button appearance="primary" icon={<Add24Regular />} onClick={handleAdd}>
            添加分类
          </Button>
        </div>

        {/* Table */}
        {loading ? (
          <div className={styles.spinnerContainer}>
            <Spinner size="large" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHeaderCell>ID</TableHeaderCell>
                <TableHeaderCell>分类名称</TableHeaderCell>
                <TableHeaderCell>Slug</TableHeaderCell>
                <TableHeaderCell>游戏</TableHeaderCell>
                <TableHeaderCell>素材数量</TableHeaderCell>
                <TableHeaderCell>排序</TableHeaderCell>
                <TableHeaderCell>操作</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.id}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>
                    <Badge appearance="outline">{category.slug}</Badge>
                  </TableCell>
                  <TableCell>{category.game?.name}</TableCell>
                  <TableCell>{(category as any)._count?.materials || 0}</TableCell>
                  <TableCell>{category.sortOrder}</TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <Tooltip content="编辑" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Edit24Regular />}
                          onClick={() => handleEdit(category)}
                        />
                      </Tooltip>
                      <Tooltip content="删除" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Delete24Regular />}
                          onClick={() => handleDelete(category.id)}
                        />
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      {/* Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(e, data) => setDialogOpen(data.open)}>
        <DialogSurface>
          <DialogBody>
            <DialogTitle>{editingCategory ? '编辑分类' : '添加分类'}</DialogTitle>
            <DialogContent>
              <div className={styles.formGrid}>
                <Field label="游戏" required>
                  <Select
                    value={formData.gameId}
                    onChange={(e, data) => setFormData({ ...formData, gameId: data.value })}
                  >
                    {games.map((g) => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </Select>
                </Field>

                <Field label="分类名称" required>
                  <Input
                    value={formData.name}
                    onChange={(e, data) => setFormData({ ...formData, name: data.value })}
                    placeholder="如：角色语音"
                  />
                </Field>

                <Field label="Slug" required>
                  <Input
                    value={formData.slug}
                    onChange={(e, data) => setFormData({ ...formData, slug: data.value })}
                    placeholder="如：character-voice（用于URL）"
                  />
                </Field>

                <Field label="排序">
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e, data) => setFormData({ ...formData, sortOrder: data.value })}
                  />
                </Field>
              </div>
            </DialogContent>
            <DialogActions>
              <Button appearance="secondary" onClick={() => setDialogOpen(false)}>取消</Button>
              <Button appearance="primary" onClick={handleSubmit}>保存</Button>
            </DialogActions>
          </DialogBody>
        </DialogSurface>
      </Dialog>
    </AdminLayout>
  );
};

export default CategoriesManagePage;

