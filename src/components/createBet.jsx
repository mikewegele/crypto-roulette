import React, { useState, useEffect } from 'react';

import { getContractInstance } from '../contract/web3'

import { Plus, X, Hash, LayoutGrid, Circle, ChevronUp, Square } from 'lucide-react';
import { createPortal } from 'react-dom';
import Web3 from "web3";

const Modal = ({ children, onClose }) => {
  return createPortal(
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      {children}
    </div>,
    document.body
  );
};

const BettingSection = ({nickname, addBet, ready}) => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedBetType, setSelectedBetType] = useState(null);
  const [betAmount, setBetAmount] = useState('');
  const [betValue, setBetValue] = useState('');

  useEffect(()=>{
    setBetAmount('');
    setBetValue('');
  },[selectedBetType])

  const betTypes = [
    { id: 'plein', name: 'Plein', range: '0-36', icon: <Hash />, description: 'Straight up bet on a single number' },
    { id: 'passe', name: 'Passe', range: '19-36', icon: <ChevronUp />, description: 'High numbers bet' },
    { id: 'manque', name: 'Manque', range: '1-18', icon: <ChevronUp />, description: 'Low numbers bet' },
    { id: 'pair', name: 'Pair', icon: <Square />, description: 'Even numbers' },
    { id: 'impair', name: 'Impair', icon: <Square />, description: 'Odd numbers' },
    { id: 'noir', name: 'Noir', icon: <Circle />, description: 'Black numbers' },
    { id: 'rouge', name: 'Rouge', icon: <Circle />, description: 'Red numbers' },
    { id: '12p', name: '12P', icon: <LayoutGrid />, description: 'First dozen (1-12)' },
    { id: '12m', name: '12M', icon: <LayoutGrid />, description: 'Second dozen (13-24)' },
    { id: '12d', name: '12D', icon: <LayoutGrid />, description: 'Third dozen (25-36)' }
  ];

  const renderBetForm = () => {
    switch(selectedBetType?.id) {
      case 'plein':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (0-36)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChangePlein}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case 'passe':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (19-36)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChangePlein}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case 'manque':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (1-18)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChangeManque}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case '12p':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (1-12)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChange12P}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case '12m':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (13-24)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChangePlein}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case '12d':
        return (
          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-200">
              Select Number (25-36)
            </label>
            <input
              type="number"
              placeholder="Enter number"
              value={betValue}
              onChange={handleChangePlein}
              onWheel={(e) => e.target.blur()}
              className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
            />
          </div>
        );
      case 'pair':
      case 'impair':
              return (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Select Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="evenOdd"
                        value="pair"
                        checked={betValue === 'pair'}
                        onChange={(e) => setBetValue(e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                      />
                      <span className="text-white">Even Numbers (Pair)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="evenOdd"
                        value="impair"
                        checked={betValue === 'impair'}
                        onChange={(e) => setBetValue(e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                      />
                      <span className="text-white">Odd Numbers (Impair)</span>
                    </label>
                  </div>
                </div>
              );
      case 'noir':
      case 'rouge':
              return (
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-200">
                    Select Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="Black"
                        value="noir"
                        checked={betValue === 'noir'}
                        onChange={(e) => setBetValue(e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                      />
                      <span className="text-white">Black (Noir)</span>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="evenOdd"
                        value="rouge"
                        checked={betValue === 'rouge'}
                        onChange={(e) => setBetValue(e.target.value)}
                        className="w-4 h-4 text-purple-600 bg-gray-700 border-gray-600 focus:ring-purple-500"
                      />
                      <span className="text-white">Red (Rouge)</span>
                    </label>
                  </div>
                </div>
              );
      
        default:
        return null;
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear().toString().substr(-2);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${day} ${month} ${year} ${hours}:${minutes}`;
  };

  const handleCreateBet = async () => {

    if( !betAmount || 0 >= betAmount || !betValue || (selectedBetType.id === 'passe' && 19 > betValue) || (selectedBetType.id === '12m' && ( betValue < 13 || betValue > 24 )) || (selectedBetType.id === '12d' && (betValue < 25 || betValue > 36))) return;


    const contract = await getContractInstance();

    if (contract) { 

      try {

        const current = await contract.methods.addBet(formatDate(Date.now()), nickname, selectedBetType.id, String(betValue), String(betAmount)).send({ from: window.ethereum.selectedAddress, value: new Web3(window.ethereum).utils.toWei("0.01", "ether") });

        if(current.blockHash){
          addBet({ id:selectedBetType.id, betAmount, betValue, createdAt: formatDate(Date.now()), nickname})
        }

      } catch (error) {
        console.error("Error reading message:", error);
      }

    }

    setIsPopupOpen(false);
    setSelectedBetType(null);
    setBetAmount('');
    setBetValue('');

  }

  const handleChangePlein = (e) => {
    const inputValue = e.target.value;

    // Ensure the value is a number within the range 0–36
    if (inputValue === "" || (Number(inputValue) >= 0 && Number(inputValue) <= 36)) {
      setBetValue(inputValue)
    }
  };

  const handleChangeManque = (e) => {
    const inputValue = e.target.value;

    // Ensure the value is a number within the range 0–36
    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 18)) {
      setBetValue(inputValue)
    }
  };

  const handleChange12P = (e) => {
    const inputValue = e.target.value;

    // Ensure the value is a number within the range 0–36
    if (inputValue === "" || (Number(inputValue) >= 1 && Number(inputValue) <= 12)) {
      setBetValue(inputValue)
    }
  };


  return (
    <>
      <div className="p-6">
        {/* Main Betting Section */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Test Your Luck?</h2>
          <p className="text-gray-300 mb-6">
            Place your bets on various combinations and multiply your winnings!
            Our premium roulette game offers multiple betting options to maximize your chances.
          </p>
          
          <button
            onClick={() => setIsPopupOpen(true)}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            disabled={ready.includes(nickname)}
          >
            <Plus className="w-5 h-5 mr-2" />
            { ready.includes(nickname) ? 'Already Ready' : 'Place Your Bet' }
          </button>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupOpen && (
        <Modal onClose={() => setIsPopupOpen(false)}>
          <div className="bg-gray-900 rounded-xl w-full max-w-4xl p-6 max-h-[90vh] overflow-y-auto m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-white">Place Your Bet</h3>
              <button
                onClick={() => {
                  setIsPopupOpen(false);
                  setSelectedBetType(null);
                }}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {!selectedBetType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {betTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedBetType(type)}
                    className="p-4 bg-gray-800 rounded-xl hover:bg-gray-700 transition-all duration-200 text-left group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-600 rounded-lg group-hover:bg-purple-500 transition-colors">
                        {type.icon}
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-white">{type.name}</h4>
                        <p className="text-sm text-gray-400">{type.description}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-gray-800 rounded-lg">
                  <h4 className="text-lg font-semibold text-white mb-4">
                    {selectedBetType.name} Bet Details
                  </h4>
                  
                  {renderBetForm()}

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Bet Amount
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 text-[#ffffff] rounded-lg border border-gray-700 focus:ring-2 focus:ring-purple-500 focus:border-transparent [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Enter amount"
                    />
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setSelectedBetType(null)}
                    className="px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Back to Bet Types
                  </button>
                  <button
                    onClick={() => {
                      // Handle bet submission
                      handleCreateBet()
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-colors flex-1"
                  >
                    Place Bet
                  </button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </>
  );
};

export default BettingSection;