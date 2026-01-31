import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { webLightTheme, webDarkTheme, Theme } from '@fluentui/react-components';

type ThemeMode = 'light' | 'dark' | 'system';

// 自定义主题颜色
export interface AppColors {
  // 背景色
  pageBg: string;
  cardBg: string;
  sidebarBg: string;
  headerBg: string;
  footerBg: string;

  // 文字颜色
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // 边框
  border: string;
  borderLight: string;

  // 渐变
  gradientPrimary: string;
  gradientSecondary: string;

  // 按钮和交互
  buttonBg: string;
  buttonHover: string;

  // 特殊颜色
  shadow: string;
  overlay: string;

  // 状态颜色
  success: string;
  warning: string;
  error: string;
}

// 暗色主题颜色
const darkColors: AppColors = {
  pageBg: '#0f0f1a',
  cardBg: '#1a1a2e',
  sidebarBg: '#1a1a2e',
  headerBg: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  footerBg: '#0a0a14',

  textPrimary: '#ffffff',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textMuted: 'rgba(255, 255, 255, 0.5)',

  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',

  gradientPrimary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientSecondary: 'linear-gradient(135deg, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.2) 100%)',

  buttonBg: 'rgba(255, 255, 255, 0.1)',
  buttonHover: 'rgba(255, 255, 255, 0.15)',

  shadow: 'rgba(0, 0, 0, 0.3)',
  overlay: 'rgba(0, 0, 0, 0.5)',

  success: '#52c41a',
  warning: '#faad14',
  error: '#ff4d4f',
};

// 亮色主题颜色
const lightColors: AppColors = {
  pageBg: '#f5f7fa',
  cardBg: '#ffffff',
  sidebarBg: '#ffffff',
  headerBg: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  footerBg: '#f0f2f5',

  textPrimary: '#1f2937',
  textSecondary: '#4b5563',
  textMuted: '#9ca3af',

  border: 'rgba(0, 0, 0, 0.1)',
  borderLight: 'rgba(0, 0, 0, 0.05)',

  gradientPrimary: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  gradientSecondary: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)',

  buttonBg: 'rgba(0, 0, 0, 0.05)',
  buttonHover: 'rgba(0, 0, 0, 0.1)',

  shadow: 'rgba(0, 0, 0, 0.1)',
  overlay: 'rgba(0, 0, 0, 0.3)',

  success: '#10b981',
  warning: '#f59e0b',
  error: '#ef4444',
};

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  theme: Theme;
  isDark: boolean;
  colors: AppColors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('theme-mode');
    return (saved as ThemeMode) || 'system';
  });

  const [systemDark, setSystemDark] = useState(() => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemDark(e.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  // Save theme preference
  useEffect(() => {
    localStorage.setItem('theme-mode', themeMode);
  }, [themeMode]);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);
  const theme = isDark ? webDarkTheme : webLightTheme;
  const colors = isDark ? darkColors : lightColors;

  // 更新 body 的背景色以匹配主题
  useEffect(() => {
    document.body.style.backgroundColor = colors.pageBg;
    document.body.style.color = colors.textPrimary;
  }, [colors]);

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, theme, isDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

