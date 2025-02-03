import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import { AppProvider } from '../context/AppContext'; 

import Home from '../pages/home';
import Login from '../pages/login';

import "./App.css";

const App = () => {

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>
    </AppProvider>
  );
};

export default App;
