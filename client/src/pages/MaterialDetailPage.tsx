import React from 'react';
import { useParams } from 'react-router-dom';
import { Layout, Typography } from 'antd';

const { Content } = Layout;
const { Title } = Typography;

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: '50px' }}>
        <Title level={2}>素材详情: {id}</Title>
        <p>素材详细信息将在这里展示...</p>
      </Content>
    </Layout>
  );
};

export default MaterialDetailPage;

