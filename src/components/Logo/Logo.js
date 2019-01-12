import React from 'react';
import burgerLogo from '../../assets/images/burger-logo.png';
import './Logo.css';

const logo = () => (
  <div className='Logo'>
    <img src={burgerLogo} alt='BurgerLogo' />
  </div>
);

export default logo;