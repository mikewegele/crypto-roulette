import React from 'react';
import { Clock } from 'lucide-react';

const BetHistoryTable = ({ bets }) => {

  console.log(bets)

  return (
    <div className="p-6">
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Clock className="w-5 h-5 text-purple-400" />
          <h2 className="text-xl font-bold text-white">Betting History</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Time</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Nickname</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Bet Type</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-gray-400">Bet Value</th>
                <th className="text-right py-4 px-4 text-sm font-medium text-gray-400">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {bets.map((bet, index) => (
                <tr 
                  key={index } 
                  className="group hover:bg-gray-700/50 transition-colors"
                >
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {bet.createdAt}
                  </td>
                  <td className="py-4 px-4 text-sm">
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full">
                      {bet.nickname}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {bet.id}
                  </td>
                  <td className="py-4 px-4 text-sm text-gray-300">
                    {bet.betValue}
                  </td>
                  <td className="py-4 px-4 text-sm text-right">
                    <span className="font-medium text-white">
                      ${bet.betAmount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {bets.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              No bets placed yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BetHistoryTable;