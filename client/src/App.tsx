import React from 'react';
export default App;

};
  );
    </ConfigProvider>
      </Router>
        </Routes>
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/material/:id" element={<MaterialDetailPage />} />
          <Route path="/game/:gameSlug" element={<GamePage />} />
          <Route path="/" element={<HomePage />} />
        <Routes>
      <Router>
    <ConfigProvider locale={zhCN}>
  return (
const App: React.FC = () => {

import AdminLoginPage from './pages/admin/LoginPage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import GamePage from './pages/GamePage';
import HomePage from './pages/HomePage';
// Pages

import './App.css';
import zhCN from 'antd/locale/zh_CN';
import { ConfigProvider } from 'antd';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

