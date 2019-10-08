import React from 'react';
import logo from './logo.svg';
import './App.css';
import { StateProvider } from './state/global';

const App: React.FC = () => {
  return (
    <StateProvider>
      <div>Placeholder</div>
    </StateProvider>
  );
}

export default App;
