import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { FluentProvider, webLightTheme } from '@fluentui/react-components';
import './App.css';

// Pages
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import MaterialDetailPage from './pages/MaterialDetailPage';
import AdminLoginPage from './pages/admin/LoginPage';
import AdminDashboard from './pages/admin/DashboardPage';
import MaterialsManagePage from './pages/admin/MaterialsPage';
import CategoriesManagePage from './pages/admin/CategoriesPage';
import TagsManagePage from './pages/admin/TagsPage';
import GamesManagePage from './pages/admin/GamesPage';

const App: React.FC = () => {
  return (
    <FluentProvider theme={webLightTheme}>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game/:gameSlug" element={<GamePage />} />
          <Route path="/material/:id" element={<MaterialDetailPage />} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/materials" element={<MaterialsManagePage />} />
          <Route path="/admin/categories" element={<CategoriesManagePage />} />
          <Route path="/admin/tags" element={<TagsManagePage />} />
          <Route path="/admin/games" element={<GamesManagePage />} />
        </Routes>
      </Router>
    </FluentProvider>
  );
};

export default App;

