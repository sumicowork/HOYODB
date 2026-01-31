import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Title3,
  Text,
  Button,
  makeStyles,
  shorthands,
  tokens,
  Avatar,
  Tooltip,
} from '@fluentui/react-components';
import {
  Home24Regular,
  SignOut24Regular,
  Board24Regular,
  Document24Regular,
  Grid24Regular,
  Tag24Regular,
  Settings24Regular,
  Navigation24Regular,
} from '@fluentui/react-icons';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    width: '260px',
    backgroundColor: '#1a1a2e',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    bottom: 0,
    zIndex: 100,
  },
  sidebarHeader: {
    ...shorthands.padding('24px'),
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
  },
  logoIcon: {
    width: '40px',
    height: '40px',
    ...shorthands.borderRadius('10px'),
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '20px',
  },
  logoText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: '20px',
  },
  logoSubtext: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '12px',
  },
  nav: {
    ...shorthands.padding('16px', '12px'),
    display: 'flex',
    flexDirection: 'column',
    ...shorthands.gap('4px'),
    flexGrow: 1,
  },
  navSection: {
    marginBottom: '16px',
  },
  navSectionTitle: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    ...shorthands.padding('8px', '12px'),
  },
  navItem: {
    justifyContent: 'flex-start',
    ...shorthands.padding('12px', '16px'),
    ...shorthands.borderRadius('10px'),
    width: '100%',
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
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    color: 'white',
    ':hover': {
      backgroundColor: 'rgba(102, 126, 234, 0.4)',
    },
  },
  navItemIcon: {
    marginRight: '12px',
    fontSize: '20px',
  },
  sidebarFooter: {
    ...shorthands.padding('16px', '12px'),
    ...shorthands.borderTop('1px', 'solid', 'rgba(255, 255, 255, 0.1)'),
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('12px'),
    ...shorthands.padding('12px'),
    ...shorthands.borderRadius('10px'),
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: '12px',
  },
  userName: {
    color: 'white',
    fontSize: '14px',
    fontWeight: '500',
  },
  userRole: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: '12px',
  },
  main: {
    flexGrow: 1,
    marginLeft: '260px',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: tokens.colorNeutralBackground3,
    minHeight: '100vh',
  },
  header: {
    backgroundColor: tokens.colorNeutralBackground1,
    ...shorthands.padding('16px', '32px'),
    ...shorthands.borderBottom('1px', 'solid', tokens.colorNeutralStroke1),
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'sticky' as const,
    top: 0,
    zIndex: 50,
    boxShadow: tokens.shadow2,
  },
  headerTitle: {
    display: 'flex',
    alignItems: 'center',
    ...shorthands.gap('16px'),
  },
  headerActions: {
    display: 'flex',
    ...shorthands.gap('8px'),
  },
  content: {
    ...shorthands.padding('32px'),
    flexGrow: 1,
  },
});

interface NavItem {
  key: string;
  label: string;
  icon: React.ReactNode;
}

const mainNavItems: NavItem[] = [
  { key: '/admin/dashboard', label: '仪表盘', icon: <Board24Regular /> },
  { key: '/admin/materials', label: '素材管理', icon: <Document24Regular /> },
  { key: '/admin/categories', label: '分类管理', icon: <Grid24Regular /> },
  { key: '/admin/tags', label: '标签管理', icon: <Tag24Regular /> },
];

const settingsNavItems: NavItem[] = [
  { key: '/admin/games', label: '游戏管理', icon: <Settings24Regular /> },
];

interface AdminLayoutProps {
  title: string;
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ title, children }) => {
  const styles = useStyles();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/admin/login');
  };

  const adminInfo = JSON.parse(localStorage.getItem('admin') || '{}');

  const renderNavItem = (item: NavItem) => (
    <Button
      key={item.key}
      appearance="subtle"
      className={`${styles.navItem} ${location.pathname === item.key ? styles.navItemActive : ''}`}
      onClick={() => navigate(item.key)}
    >
      <span className={styles.navItemIcon}>{item.icon}</span>
      {item.label}
    </Button>
  );

  return (
    <div className={styles.root}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <Navigation24Regular />
            </div>
            <div>
              <div className={styles.logoText}>HOYODB</div>
              <div className={styles.logoSubtext}>管理后台</div>
            </div>
          </div>
        </div>

        <nav className={styles.nav}>
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>主要功能</div>
            {mainNavItems.map(renderNavItem)}
          </div>

          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>系统设置</div>
            {settingsNavItems.map(renderNavItem)}
          </div>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userInfo}>
            <Avatar
              name={adminInfo.username || 'Admin'}
              size={36}
              color="colorful"
            />
            <div>
              <div className={styles.userName}>{adminInfo.username || 'Admin'}</div>
              <div className={styles.userRole}>管理员</div>
            </div>
          </div>
          <Button
            appearance="subtle"
            icon={<Home24Regular />}
            className={styles.navItem}
            onClick={() => navigate('/')}
          >
            前往首页
          </Button>
          <Button
            appearance="subtle"
            icon={<SignOut24Regular />}
            className={styles.navItem}
            onClick={handleLogout}
          >
            退出登录
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerTitle}>
            <Title3>{title}</Title3>
          </div>
          <div className={styles.headerActions}>
            <Tooltip content="返回首页" relationship="label">
              <Button
                appearance="subtle"
                icon={<Home24Regular />}
                onClick={() => navigate('/')}
              />
            </Tooltip>
          </div>
        </header>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

