import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const GamePage: React.FC = () => {
  const { gameSlug } = useParams<{ gameSlug: string }>();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>游戏页面: {gameSlug}</Title>
        <p>游戏素材列表将在这里展示...</p>
      </Content>
    </Layout>
  );
};

export default GamePage;

