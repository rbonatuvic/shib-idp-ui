import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

jest.mock('./App.constant', () => ({
  get API_BASE_PATH() {
    return '/';
  }
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  const root = createRoot(div);

  root.render(<App />);
});