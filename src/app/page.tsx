'use client';

import { Provider } from 'react-redux';
import { store } from '@/store/store';
import EmployeeList from '@/components/Employee/EmployeeList';
import { ConfigProvider } from 'antd';
import thTH from 'antd/locale/th_TH';
import MainLayout from '@/components/Layout/MainLayout';

export default function Home() {
  return (
    <ConfigProvider
      locale={thTH}
      theme={{
        token: {
          fontFamily: 'Kanit, sans-serif',
        },
      }}
    >
      <Provider store={store}>
        <MainLayout>
          <EmployeeList />
        </MainLayout>
      </Provider>
    </ConfigProvider>
  );
} 