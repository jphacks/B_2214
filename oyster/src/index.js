import React from 'react';
import ReactDOM from 'react-dom/client';

import TopPage from './components/TopPage';
import App from './pages/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App>
      <TopPage />
    </App>
  </React.StrictMode>,
);
