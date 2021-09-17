import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

jest.mock('./App.constant', () => ({
  get API_BASE_PATH() {
    return '/';
  }
}));

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});