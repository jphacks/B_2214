import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';
import TopPage from './components/TopPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App>
      <TopPage/>
    </App>
  </React.StrictMode>
);