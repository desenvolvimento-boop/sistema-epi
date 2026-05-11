import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <AppRouter />
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}
