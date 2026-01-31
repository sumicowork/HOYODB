import React from 'react';
import {
  Button,
  Menu,
  MenuTrigger,
  MenuList,
  MenuItem,
  MenuPopover,
  makeStyles,
} from '@fluentui/react-components';
import {
  WeatherSunny24Regular,
  WeatherMoon24Regular,
  Desktop24Regular,
} from '@fluentui/react-icons';
import { useTheme } from '../contexts/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

const useStyles = makeStyles({
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
});

const ThemeToggle: React.FC<ThemeToggleProps> = ({ className }) => {
  const styles = useStyles();
  const { themeMode, setThemeMode, isDark } = useTheme();

  const getIcon = () => {
    if (themeMode === 'system') {
      return <Desktop24Regular />;
    }
    return isDark ? <WeatherMoon24Regular /> : <WeatherSunny24Regular />;
  };

  const getLabel = () => {
    switch (themeMode) {
      case 'light':
        return '浅色';
      case 'dark':
        return '深色';
      case 'system':
        return '跟随系统';
    }
  };

  return (
    <Menu>
      <MenuTrigger disableButtonEnhancement>
        <Button
          appearance="subtle"
          icon={getIcon()}
          className={className}
          title={`当前主题: ${getLabel()}`}
        />
      </MenuTrigger>
      <MenuPopover>
        <MenuList>
          <MenuItem
            icon={<WeatherSunny24Regular />}
            onClick={() => setThemeMode('light')}
          >
            <span className={styles.menuItem}>
              浅色模式
              {themeMode === 'light' && ' ✓'}
            </span>
          </MenuItem>
          <MenuItem
            icon={<WeatherMoon24Regular />}
            onClick={() => setThemeMode('dark')}
          >
            <span className={styles.menuItem}>
              深色模式
              {themeMode === 'dark' && ' ✓'}
            </span>
          </MenuItem>
          <MenuItem
            icon={<Desktop24Regular />}
            onClick={() => setThemeMode('system')}
          >
            <span className={styles.menuItem}>
              跟随系统
              {themeMode === 'system' && ' ✓'}
            </span>
          </MenuItem>
        </MenuList>
      </MenuPopover>
    </Menu>
  );
};

export default ThemeToggle;

