import React from 'react';
import { Layout, Typography } from 'antd';

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const HomePage: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <Title level={3} style={{ margin: '16px 0' }}>
          HOYODB - 米哈游游戏素材数据库
        </Title>
      </Header>
      <Content style={{ padding: '50px' }}>
        <div style={{ textAlign: 'center', marginTop: '100px' }}>
          <Title level={1}>欢迎来到 HOYODB</Title>
          <p style={{ fontSize: '18px', marginTop: '20px' }}>
            米哈游游戏素材资源库
          </p>
          <p style={{ marginTop: '10px', color: '#666' }}>
            正在建设中...
          </p>
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        HOYODB ©{new Date().getFullYear()} Created by HOYODB Team
      </Footer>
    </Layout>
  );
};

export default HomePage;

