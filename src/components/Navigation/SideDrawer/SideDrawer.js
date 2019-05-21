import React from 'react';
import NavigationItems from '../NavigationItems/NavigationItems';
import Logo from '../../Logo/Logo';
import Backdrop from '../../UI/Backdrop/Backdrop';

import './SideDrawer.css';

const sideDrawer = (props) => {
  let attachedClasses = ['SideDrawer', 'Close'];
  if(props.open) {
    attachedClasses = ['SideDrawer', 'Open'];
  }
  return (
    <>
      <Backdrop show={props.open} clicked={props.closed}/>
      <div className={attachedClasses.join(' ')}>
        <div className='Logo SideDrawer'>
          <Logo />
        </div>
        <nav className='Overide'>
          <NavigationItems isAuthenticated={props.isAuth}/>
        </nav>
      </div>
    </>
  )
}

export default sideDrawer;