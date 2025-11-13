import React, { useState } from 'react';
import { Outlet } from '@tanstack/react-router';
import Navbar from './components/Navbar';

const App = () => {

  return (
    <div>
      <Navbar/>
      <Outlet />
    </div>
  );
};

export default App;