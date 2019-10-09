import React from 'react';
import logo from './logo.svg';
import './App.css';
import LocalDBForm from './components/LocalDBForm';

const App: React.FC = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <LocalDBForm />
      </header>
    </div>
  );
}

export default App;
