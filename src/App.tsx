import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AppRouter } from './router/AppRouter';
import { AuthProvider } from './contexts/AuthContext';
import { NomenclatureProvider } from './contexts/NomenclatureContext';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NomenclatureProvider>
          <Layout>
            <AppRouter />
          </Layout>
        </NomenclatureProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
