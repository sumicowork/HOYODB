import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  Title1,
  Title3,
  Text,
  Input,
  Button,
  Field,
  Spinner,
  makeStyles,
  shorthands,
  tokens,
  MessageBar,
  MessageBarBody,
} from '@fluentui/react-components';
import {
  Person24Regular,
  LockClosed24Regular,
  Home24Regular,
  ArrowRight24Regular,
} from '@fluentui/react-icons';
import { api } from '../../services/api';

const useStyles = makeStyles({
  root: {
    minHeight: '100vh',
    display: 'flex',
    background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
    position: 'relative' as const,
    ...shorthands.overflow('hidden'),
  },
  backgroundDecor: {
    position: 'absolute' as const,
    width: '600px',
    height: '600px',
    ...shorthands.borderRadius('50%'),
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
    filter: 'blur(80px)',
  },
  decorTop: {
    top: '-200px',
    right: '-200px',
  },
  decorBottom: {
    bottom: '-200px',
    left: '-200px',
  },
  leftPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...shorthands.padding('48px'),
    position: 'relative' as const,
    zIndex: 1,
  },
  brandSection: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  logoWrapper: {
    width: '80px',
    height: '80px',
    ...shorthands.borderRadius('20px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    ...shorthands.margin('0', 'auto', '24px'),
    boxShadow: '0 10px 40px rgba(102, 126, 234, 0.4)',
  },
  logoText: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
  },
  brandTitle: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
  },
  card: {
    width: '420px',
    ...shorthands.padding('40px'),
    ...shorthands.borderRadius('20px'),
    backgroundColor: 'rgba(26, 26, 46, 0.8)',
    backdropFilter: 'blur(20px)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
  },
  cardHeader: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  cardTitle: {
    color: 'white',
    fontSize: '24px',
    fontWeight: 'bold',
    marginBottom: '8px',
  },
  cardSubtitle: {
    color: 'rgba(255, 255, 255, 0.5)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('20px'),
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('8px'),
  },
  fieldLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '14px',
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    ...shorthands.border('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
    ...shorthands.borderRadius('10px'),
    color: 'white',
    ':focus': {
      ...shorthands.borderColor('rgba(102, 126, 234, 0.5)'),
    },
  },
  inputIcon: {
    color: 'rgba(255, 255, 255, 0.4)',
  },
  submitButton: {
    height: '48px',
    ...shorthands.borderRadius('10px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontWeight: '600',
    fontSize: '16px',
    marginTop: '8px',
    ...shorthands.border('none'),
    ':hover': {
      background: 'linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)',
    },
  },
  footer: {
    textAlign: 'center',
    marginTop: '24px',
    paddingTop: '24px',
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  homeButton: {
    color: 'rgba(255, 255, 255, 0.6)',
    ':hover': {
      color: 'white',
    },
  },
  errorMessage: {
    ...shorthands.borderRadius('10px'),
    marginBottom: '16px',
  },
});

const AdminLoginPage: React.FC = () => {
  const styles = useStyles();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('请输入用户名和密码');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.login(username, password);
      const { token, admin } = response.data.data;

      localStorage.setItem('token', token);
      localStorage.setItem('admin', JSON.stringify(admin));

      navigate('/admin/dashboard');
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || '登录失败，请检查用户名和密码';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.root}>
      {/* Background Decorations */}
      <div className={`${styles.backgroundDecor} ${styles.decorTop}`} />
      <div className={`${styles.backgroundDecor} ${styles.decorBottom}`} />

      {/* Left Panel */}
      <div className={styles.leftPanel}>
        {/* Brand */}
        <div className={styles.brandSection}>
          <div className={styles.logoWrapper}>
            <span className={styles.logoText}>H</span>
          </div>
          <h1 className={styles.brandTitle}>HOYODB</h1>
          <p className={styles.brandSubtitle}>米哈游游戏素材数据库管理系统</p>
        </div>

        {/* Login Card */}
        <Card className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>管理员登录</h2>
            <Text className={styles.cardSubtitle}>请输入您的管理员账号</Text>
          </div>

          {error && (
            <MessageBar intent="error" className={styles.errorMessage}>
              <MessageBarBody>{error}</MessageBarBody>
            </MessageBar>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>用户名</label>
              <Input
                contentBefore={<Person24Regular className={styles.inputIcon} />}
                placeholder="请输入用户名"
                value={username}
                onChange={(e, data) => setUsername(data.value)}
                size="large"
                className={styles.input}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel}>密码</label>
              <Input
                contentBefore={<LockClosed24Regular className={styles.inputIcon} />}
                type="password"
                placeholder="请输入密码"
                value={password}
                onChange={(e, data) => setPassword(data.value)}
                size="large"
                className={styles.input}
              />
            </div>

            <Button
              appearance="primary"
              type="submit"
              className={styles.submitButton}
              disabled={loading}
              icon={loading ? <Spinner size="tiny" /> : <ArrowRight24Regular />}
              iconPosition="after"
            >
              {loading ? '登录中...' : '登录'}
            </Button>
          </form>

          <div className={styles.footer}>
            <Button
              appearance="transparent"
              icon={<Home24Regular />}
              onClick={() => navigate('/')}
              className={styles.homeButton}
            >
              返回首页
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminLoginPage;

