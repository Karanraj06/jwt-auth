import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';
import { UserInfoProvider } from './context/user-info-context.tsx';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <UserInfoProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </UserInfoProvider>
  </React.StrictMode>
);
