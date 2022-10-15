import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './pages/App';
import TopPage from './pages/TopPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <App>
      <TopPage />
    </App>
  </>,
);
