import React, { useState, useContext } from 'react';

import { getContractInstance } from '../contract/web3'



import { ChevronRight, Dices } from 'lucide-react';

import { Navigate } from 'react-router-dom';

import { AppContext } from '../context/AppContext';

const LoginPage = () => {

  const { nickname, signIn } = useContext(AppContext);

  const [name, setNick] = useState('');
  

  if (nickname) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const contract = await getContractInstance();
        
    if (contract) {
      try {

          const currentUsers = await contract.methods.getUsers().call();

          if(currentUsers.length >= 10) return ;

          let newNickname = '' ; 

          if(currentUsers.includes(name)){
            newNickname = name + '_' + Math.random().toString(36).substring(2, 8) ;
          } else {
            newNickname = name ;
          }

              
          const current = await contract.methods.register(newNickname).send({ from: window.ethereum.selectedAddress });
    
          if(current.blockHash){
            console.log('Registration successful!'); 
            signIn(newNickname);

          }
  
      } catch (error) {
        console.error("Error reading message:", error);
      }
    }

      // await contract.methods.register().send({ from: account });
      // const count = await contract.methods.getPlayerCount().call();
      // setPlayerCount(count);
      // const playerList = await contract.methods.getPlayers().call();
      // setPlayers(playerList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black flex flex-col items-center justify-center p-4">
      {/* Logo Section with Animation */}
      <div className="mb-12 text-center animate-fade-in">
        <div className="flex items-center justify-center mb-4">
          <Dices className="w-12 h-12 text-purple-500 animate-spin-slow" />
        </div>
        <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-['Racing Sans One']">
          SPINFORTUNE
        </h1>
        <p className="text-gray-400 mt-2 animate-pulse">Where Luck Meets Luxury</p>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 shadow-2xl transform hover:scale-105 transition-all duration-300">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome to the Game</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Nickname</label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setNick(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300 text-white placeholder-gray-400"
                  placeholder="Enter your nickname"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center py-3 px-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-lg font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              <span>Start Playing</span>
              <ChevronRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          {/* Additional Content */}
          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center space-x-4">
              <div className="h-px flex-1 bg-gray-700"></div>
              <span className="text-sm text-gray-400">Featured Game</span>
              <div className="h-px flex-1 bg-gray-700"></div>
            </div>
            
            <div className="text-center space-y-2">
              <p className="text-lg font-semibold text-purple-400">European Roulette</p>
              <p className="text-sm text-gray-400">Experience the thrill of the classic casino game</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-400">
          <p>By entering, you agree to our Terms of Service</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;