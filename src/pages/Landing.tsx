import React from 'react';
import LocalDBForm from 'src/components/LocalDBForm';
import logo from './logo.png';

const Landing: React.FC = () => (
  <div className="App">
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <LocalDBForm />
    </header>
  </div>
);

export default Landing
