import React from 'react';
import LocalDBForm from '../components/LocalDBForm';
import logo3 from './logo3.png';
import LandingStyles from './Landing.module.css';

const Landing: React.FC = () => (
  <div className={LandingStyles.container}>
    <div className={LandingStyles.logoBanner}>
      <img src={logo3} alt="logo" className={LandingStyles.logo} />
      <div className={LandingStyles.logoTitle}>
        <p className={LandingStyles.logoCharacterMain}>tar</p>
        <p className={LandingStyles.logoCharacterDB}>d</p>
        <p className={LandingStyles.logoCharacterSmall}>i</p>
        <p className={LandingStyles.logoCharacterDB}>b</p>
      </div>
    </div>
    <LocalDBForm />
  </div>
);

export default Landing
