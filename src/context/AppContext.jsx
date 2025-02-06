import React, { createContext, useState, useEffect } from 'react';

// Create the context
export const AppContext = createContext();

// Create a provider component
export const AppProvider = ({ children }) => {
  const [nickname, setNickname] = useState('');
  const [bets, setBets] = useState([]);

  useEffect(() => {
    loadUser(); 
  }, []);


  const signIn = newNickname => {

    localStorage.setItem('userNickname', newNickname);

    setNickname(newNickname);
  };

  const logout = () => {

    localStorage.removeItem('userNickname')
    
    setNickname('');

  }

  const loadUser = () => {

    const username = localStorage.getItem('userNickname') ? localStorage.getItem('userNickname') : '' ;

    setNickname(username);
    
  }


  const addBet = (bet) => {

    setBets([bet, ...bets]);
  }

  const initBets = (bets) => {

    setBets(bets);
  }

  // Value to pass to the provider
  const value = { nickname, signIn,logout, loadUser, bets, setBets, addBet, initBets };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
