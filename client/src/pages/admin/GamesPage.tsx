import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
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
  Input,
  Switch,
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
import { adminApi, Game } from '../../services/api';

const useStyles = makeStyles({
  toolbar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '16px',
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
  switchField: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('8px'),
  },
});

const GamesManagePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: '',
    sortOrder: '0',
    isActive: true,
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

  const loadGames = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getGames();
      setGames(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: '加载游戏列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingGame(null);
    setFormData({
      name: '',
      slug: '',
      icon: '',
      sortOrder: '0',
      isActive: true,
    });
    setDialogOpen(true);
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData({
      name: game.name,
      slug: game.slug,
      icon: game.icon || '',
      sortOrder: String(game.sortOrder),
      isActive: game.isActive,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个游戏吗？删除后所有关联的分类和素材也将被删除！')) return;

    try {
      await adminApi.deleteGame(id);
      setMessage({ type: 'success', text: '删除成功' });
      loadGames();
    } catch (error) {
      setMessage({ type: 'error', text: '删除失败，可能有分类或素材关联此游戏' });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        icon: formData.icon || undefined,
        sortOrder: parseInt(formData.sortOrder),
        isActive: formData.isActive,
      };

      if (editingGame) {
        await adminApi.updateGame(editingGame.id, data);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        await adminApi.createGame(data);
        setMessage({ type: 'success', text: '创建成功' });
      }

      setDialogOpen(false);
      loadGames();
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  return (
    <AdminLayout title="游戏管理">
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
          <Button appearance="primary" icon={<Add24Regular />} onClick={handleAdd}>
            添加游戏
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
                <TableHeaderCell>游戏名称</TableHeaderCell>
                <TableHeaderCell>Slug</TableHeaderCell>
                <TableHeaderCell>状态</TableHeaderCell>
                <TableHeaderCell>素材数量</TableHeaderCell>
                <TableHeaderCell>分类数量</TableHeaderCell>
                <TableHeaderCell>排序</TableHeaderCell>
                <TableHeaderCell>操作</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {games.map((game) => (
                <TableRow key={game.id}>
                  <TableCell>{game.id}</TableCell>
                  <TableCell>{game.name}</TableCell>
                  <TableCell>
                    <Badge appearance="outline">{game.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      appearance="filled"
                      color={game.isActive ? 'success' : 'subtle'}
                    >
                      {game.isActive ? '已开放' : '未开放'}
                    </Badge>
                  </TableCell>
                  <TableCell>{(game as any)._count?.materials || 0}</TableCell>
                  <TableCell>{(game as any)._count?.categories || 0}</TableCell>
                  <TableCell>{game.sortOrder}</TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <Tooltip content="编辑" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Edit24Regular />}
                          onClick={() => handleEdit(game)}
                        />
                      </Tooltip>
                      <Tooltip content="删除" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Delete24Regular />}
                          onClick={() => handleDelete(game.id)}
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
            <DialogTitle>{editingGame ? '编辑游戏' : '添加游戏'}</DialogTitle>
            <DialogContent>
              <div className={styles.formGrid}>
                <Field label="游戏名称" required>
                  <Input
                    value={formData.name}
                    onChange={(e, data) => setFormData({ ...formData, name: data.value })}
                    placeholder="如：崩坏：星穹铁道"
                  />
                </Field>

                <Field label="Slug" required>
                  <Input
                    value={formData.slug}
                    onChange={(e, data) => setFormData({ ...formData, slug: data.value })}
                    placeholder="如：starrail（用于URL）"
                  />
                </Field>

                <Field label="图标URL">
                  <Input
                    value={formData.icon}
                    onChange={(e, data) => setFormData({ ...formData, icon: data.value })}
                    placeholder="游戏图标链接（可选）"
                  />
                </Field>

                <Field label="排序">
                  <Input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e, data) => setFormData({ ...formData, sortOrder: data.value })}
                  />
                </Field>

                <div className={styles.switchField}>
                  <Switch
                    checked={formData.isActive}
                    onChange={(e, data) => setFormData({ ...formData, isActive: data.checked })}
                  />
                  <Text>{formData.isActive ? '已开放' : '未开放'}</Text>
                </div>
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

export default GamesManagePage;

