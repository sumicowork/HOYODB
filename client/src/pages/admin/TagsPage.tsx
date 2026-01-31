import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
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
  Input,
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
import { adminApi, Tag } from '../../services/api';

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

const tagTypeLabels: Record<string, string> = {
  CHARACTER: '角色',
  ELEMENT: '元素',
  RARITY: '稀有度',
  VERSION: '版本',
  SCENE: '场景',
  OTHER: '其他',
};

const tagTypeColors: Record<string, 'brand' | 'success' | 'warning' | 'danger' | 'informative' | 'subtle'> = {
  CHARACTER: 'brand',
  ELEMENT: 'success',
  RARITY: 'warning',
  VERSION: 'informative',
  SCENE: 'brand',
  OTHER: 'subtle',
};

const TagsManagePage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();

  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'CHARACTER',
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadTags();
  }, [filterType]);

  const loadTags = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getTags(filterType || undefined);
      setTags(response.data.data);
    } catch (error) {
      setMessage({ type: 'error', text: '加载标签列表失败' });
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTag(null);
    setFormData({
      name: '',
      slug: '',
      type: 'CHARACTER',
    });
    setDialogOpen(true);
  };

  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormData({
      name: tag.name,
      slug: tag.slug,
      type: tag.type,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这个标签吗？')) return;

    try {
      await adminApi.deleteTag(id);
      setMessage({ type: 'success', text: '删除成功' });
      loadTags();
    } catch (error) {
      setMessage({ type: 'error', text: '删除失败' });
    }
  };

  const handleSubmit = async () => {
    try {
      const data = {
        name: formData.name,
        slug: formData.slug,
        type: formData.type,
      };

      if (editingTag) {
        await adminApi.updateTag(editingTag.id, data);
        setMessage({ type: 'success', text: '更新成功' });
      } else {
        await adminApi.createTag(data);
        setMessage({ type: 'success', text: '创建成功' });
      }

      setDialogOpen(false);
      loadTags();
    } catch (error) {
      setMessage({ type: 'error', text: '操作失败' });
    }
  };

  return (
    <AdminLayout title="标签管理">
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
            <Text>标签类型：</Text>
            <Select
              value={filterType}
              onChange={(e, data) => setFilterType(data.value)}
              style={{ minWidth: 150 }}
            >
              <option value="">全部类型</option>
              {Object.entries(tagTypeLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>

          <Button appearance="primary" icon={<Add24Regular />} onClick={handleAdd}>
            添加标签
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
                <TableHeaderCell>标签名称</TableHeaderCell>
                <TableHeaderCell>Slug</TableHeaderCell>
                <TableHeaderCell>类型</TableHeaderCell>
                <TableHeaderCell>关联素材</TableHeaderCell>
                <TableHeaderCell>操作</TableHeaderCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tags.map((tag) => (
                <TableRow key={tag.id}>
                  <TableCell>{tag.id}</TableCell>
                  <TableCell>{tag.name}</TableCell>
                  <TableCell>
                    <Badge appearance="outline">{tag.slug}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge appearance="filled" color={tagTypeColors[tag.type]}>
                      {tagTypeLabels[tag.type] || tag.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{(tag as any)._count?.materials || 0}</TableCell>
                  <TableCell>
                    <div className={styles.actions}>
                      <Tooltip content="编辑" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Edit24Regular />}
                          onClick={() => handleEdit(tag)}
                        />
                      </Tooltip>
                      <Tooltip content="删除" relationship="label">
                        <Button
                          appearance="subtle"
                          icon={<Delete24Regular />}
                          onClick={() => handleDelete(tag.id)}
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
            <DialogTitle>{editingTag ? '编辑标签' : '添加标签'}</DialogTitle>
            <DialogContent>
              <div className={styles.formGrid}>
                <Field label="标签名称" required>
                  <Input
                    value={formData.name}
                    onChange={(e, data) => setFormData({ ...formData, name: data.value })}
                    placeholder="如：三月七"
                  />
                </Field>

                <Field label="Slug" required>
                  <Input
                    value={formData.slug}
                    onChange={(e, data) => setFormData({ ...formData, slug: data.value })}
                    placeholder="如：march-7th（用于URL）"
                  />
                </Field>

                <Field label="类型" required>
                  <Select
                    value={formData.type}
                    onChange={(e, data) => setFormData({ ...formData, type: data.value })}
                  >
                    {Object.entries(tagTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </Select>
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

export default TagsManagePage;

