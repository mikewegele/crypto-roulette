import React, { useContext, useEffect, useState } from 'react';

import { getContractInstance } from '../contract/web3'

import { Dices, Users } from 'lucide-react';

import { AppContext } from '../context/AppContext';
import { Navigate } from 'react-router-dom';

import BettingSection from '../components/createBet';
import BetHistoryTable from '../components/allBets';

import { CircleCheckBig } from 'lucide-react';



const HomePage = () => {
    const { nickname, logout, bets, addBet, initBets } = useContext(AppContext);
    const [users, setUsers] = useState([]);
    const [ready, setReady] = useState([]);
    const [winningNumber, setWinningNumber] = useState(null);
    const [balanceHistory, setBalanceHistory] = useState({ oldBalance: null, newBalance: null });
    const [showDialog, setShowDialog] = useState(false);

    useEffect(() => {
        const loadMessage = async () => {
            const contract = await getContractInstance();
            if (contract) {
                try {
                    // Load users
                    const currentUsers = await contract.methods.getUsers().call();
                    let current = [];
                    currentUsers.forEach((elm, i) => {
                        current.push({ id: i, nickname: elm, lastActive: "now" });
                    });
                    setUsers(current);

                    // Load bets
                    const currentBets = await contract.methods.getBets().call();
                    console.log(currentBets)
                    const all_bets = [];
                    currentBets.forEach(elm => {
                        all_bets.push({ id: elm.bet, betAmount: elm.amount, betValue: elm.value, createdAt: elm.time, nickname: elm.nickname });
                    });
                    initBets(all_bets);

                    // Load ready players
                    const currentReadyUsers = await contract.methods.getReady().call();
                    setReady(currentReadyUsers);

                    // Load winning number
                    const currentWinningNumber = await contract.methods.getWinningNumber().call();
                    if (currentWinningNumber) {
                        setWinningNumber(currentWinningNumber.toString());
                        // Load balance history (old and new)
                        const playerAddress = window.ethereum.selectedAddress;
                        const balanceHistoryData = await contract.methods.getBalanceHistory(playerAddress).call();
                        console.log(balanceHistoryData)
                        const oldBalance = balanceHistoryData[0].toString() || 0; // Default to 0 if no history
                        const newBalance = balanceHistoryData[balanceHistoryData.length - 1].toString() || oldBalance; // Default to last balance if no new balance
                        setBalanceHistory({ oldBalance, newBalance });

                        // Show the dialog
                        setShowDialog(true);
                    }
                } catch (error) {
                    console.error("Error reading message:", error);
                }
            }
        };

        loadMessage();
    }, []);

    if (nickname === '') {
        return <Navigate to="/login" replace />;
    }

    const onLogout = async () => {
        const contract = await getContractInstance();
        if (contract) {
            try {
                const current = await contract.methods.logout(nickname).send({ from: window.ethereum.selectedAddress });
                if (current.blockHash) {
                    console.log('Logout successfully!');
                    logout();
                }
            } catch (error) {
                console.error("Error reading message:", error);
            }
        }
    };

    const onSetReady = async () => {
        const contract = await getContractInstance();
        if (contract) {
            const current = await contract.methods.addReadyUser(nickname).send({ from: window.ethereum.selectedAddress });
            if (current.blockHash) {
                console.log('Set Status to Ready successful!');
                setReady([nickname, ...ready]);
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-gray-900 to-black">
            {/* Header with Logo */}
            <header className="w-full py-4 px-6 bg-black/30 backdrop-blur-sm">
                <div className="flex items-center space-x-3">
                    <Dices className="w-8 h-8 text-purple-500" />
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500 font-['Racing Sans One']">
                        SPINFORTUNE
                    </h1>
                </div>
                <p className="text-gray-400 mt-1 ml-11">Where Luck Meets Luxury</p>
            </header>

            {/* Main Content Container */}
            <div className="flex">
                {/* Main Content Area (70%) */}
                <div className="w-[70%] p-6 border-r border-gray-800">

                    <div className="h-full rounded-xl bg-gray-800/20 backdrop-blur-sm p-6">
                        <h2 className="text-2xl font-bold text-white mb-4">Welcome to SpinFortune</h2>
                        <p className="text-gray-300">
                            Experience the thrill of premium online roulette gaming.
                            Our platform offers you the most authentic casino experience from the comfort of your home.
                        </p>

                        <BettingSection nickname={nickname} addBet={addBet} ready={ready} />
                        <BetHistoryTable bets={bets} />

                        <div style={{ display: 'flex', justifyContent: 'end' }}>
                            <button
                                className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                style={{ marginRight: '22px' }}
                                disabled={ready.includes(nickname)}
                                onClick={onSetReady}
                            >
                                <CircleCheckBig className="w-5 h-5 mr-2" />
                                {ready.includes(nickname) ? 'Waiting for other Players' : 'Ready To Play'}
                            </button>
                        </div>
                    </div>

                </div>

                {/* Sidebar (30%) */}
                <div className="w-[30%] p-6 space-y-6">
                    {/* Logout Button Section */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                        <button className="relative w-full px-7 py-4 bg-black rounded-lg leading-none flex items-center justify-center space-x-3" onClick={onLogout}>
                            <span className="text-purple-400 group-hover:text-gray-100 transition duration-200">Logout</span>
                        </button>
                    </div>

                    {/* Online Users Card */}
                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
                        <div className="flex items-center space-x-2 mb-6">
                            <Users className="w-5 h-5 text-purple-400" />
                            <h3 className="text-lg font-semibold text-white">Online Players</h3>
                        </div>
                        <div className="space-y-4">
                            {users.map((user, index) => (
                                <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-700/50 transition-all duration-300">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-2 h-2 bg-green-500 rounded-full absolute -right-0.5 -top-0.5"></div>
                                            <div className="w-8 h-8 bg-purple-600/50 rounded-full flex items-center justify-center">
                                                {user.nickname.charAt(0)}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-white font-medium">
                                                {user.nickname}
                                                {nickname === user.nickname ? ' (you)' : ''}
                                                {ready.includes(user.nickname) ? ' (ready To Play)' : ''}
                                            </p>
                                            <p className="text-xs text-green-400">Online • {user.lastActive}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog for Winning Number and Balance */}
            {showDialog && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 rounded-xl p-8 w-96">
                        <h3 className="text-2xl font-bold text-white mb-4">Winning Number</h3>
                        <p className="text-white">Winning Number: {winningNumber}</p>
                        <p className="text-white mt-4">Old Balance: {balanceHistory.oldBalance}</p>
                        <p className="text-white">New Balance: {balanceHistory.newBalance}</p>
                        <button
                            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg"
                            onClick={() => setShowDialog(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

        </div>
    );
};

export default HomePage;
