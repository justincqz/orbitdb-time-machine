import React from 'react';
import LocalDBForm from '../components/LocalDBForm';
import logo from './logo.png';
import LandingStyles from './Landing.module.css';

const Landing: React.FC = () => (
  <div className={LandingStyles.container}>
    <img src={logo} alt="logo" className={LandingStyles.logo} />
    <LocalDBForm />
  </div>
);

export default Landing
