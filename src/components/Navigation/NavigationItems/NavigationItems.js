import React from 'react';
import NavigationItem from './NavigationItem/NavigationItem';
import './NavigationItems.css'

const navigationItems = (props) => (
  <ul className='NavigationItems'>
    <NavigationItem link='/' exact>Burger Builder</NavigationItem>
    <NavigationItem link='/orders'>Orders</NavigationItem>
    {props.isAuthenticated
      ? <NavigationItem link='/logout'>Logout</NavigationItem>
      : <NavigationItem link='/auth'>Authentication</NavigationItem>
    }
  </ul>
);

export default navigationItems;