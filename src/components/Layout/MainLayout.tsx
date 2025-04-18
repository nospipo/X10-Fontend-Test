import React from 'react';
import { Layout, Menu, theme } from 'antd';
import { UserOutlined, TeamOutlined } from '@ant-design/icons';
import Link from 'next/link';

const { Header, Content, Sider } = Layout;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          background: colorBgContainer,
          borderBottom: "1px solid #f0f0f0",
        }}
      >
        <div className="text-xl font-semibold">
          ระบบจัดการข้อมูลพนักงาน
        </div>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            style={{ height: "100%", borderRight: 0 }}
            items={[
              {
                key: "1",
                icon: <TeamOutlined />,
                label: <Link href="/">รายชื่อพนักงาน</Link>,
              },
              {
                key: "2",
                icon: <UserOutlined />,
                label: <Link href="/profile">ข้อมูลส่วนตัว</Link>,
              },
            ]}
          />
        </Sider>
        <Layout style={{ padding: "24px" }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 