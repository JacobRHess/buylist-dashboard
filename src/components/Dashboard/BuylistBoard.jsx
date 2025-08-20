import React, { useState } from 'react';
import { STATUSES } from '../../utils';
import { useBuylists, useAuth } from '../../hooks';
import { LoadingSpinner, ErrorDisplay } from '../UI';
import BuylistCard from './BuylistCard';

const BuylistBoard = ({ 
  searchTerm, 
  showStatusDropdown, 
  setShowStatusDropdown, 
  setShowHistoryModal 
}) => {
  const { currentUser } = useAuth();
  const { buylists, loading, error, updateBuylistStatus } = useBuylists();

  const filteredBuylists = buylists.filter(buylist => {
    const matchesSearch = buylist.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buylist.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buylist.cards.some(card => 
                           card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.set.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesSearch;
  });

  const getBuylistsByStatus = (status) => {
    return filteredBuylists.filter(buylist => buylist.status === status);
  };

  const handleStatusChange = (buylistId, newStatus) => {
    updateBuylistStatus(buylistId, newStatus, currentUser?.name || 'Unknown');
    setShowStatusDropdown(null);
  };

  const handleDragStart = (e, buylist) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(buylist));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    try {
      const buylist = JSON.parse(e.dataTransfer.getData('text/plain'));
      if (buylist && buylist.status !== newStatus) {
        handleStatusChange(buylist.id, newStatus);
      }
    } catch (error) {
      console.error('Error handling drop:', error);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex space-x-4 overflow-x-auto min-h-[600px]">
        {STATUSES.map(status => {
          const StatusIcon = status.icon;
          const buylistsInStatus = getBuylistsByStatus(status.key);
          
          return (
            <div
              key={status.key}
              className="flex-shrink-0 w-80 bg-gray-50 rounded-lg p-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, status.key)}
            >
              <div className="flex items-center mb-4 sticky top-0 z-10 bg-gray-50 pb-2">
                <div className={`w-3 h-3 rounded-full ${status.color} mr-2`}></div>
                <h3 className="font-semibold text-sm text-gray-800">{status.title}</h3>
                <span className="ml-2 text-xs px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
                  {buylistsInStatus.length}
                </span>
              </div>
              
              <div className="space-y-3 overflow-y-auto max-h-[500px]">
                {buylistsInStatus.map(buylist => (
                  <BuylistCard 
                    key={buylist.id} 
                    buylist={buylist} 
                    onStatusChange={handleStatusChange}
                    onDragStart={handleDragStart}
                    showStatusDropdown={showStatusDropdown}
                    setShowStatusDropdown={setShowStatusDropdown}
                    setShowHistoryModal={setShowHistoryModal}
                  />
                ))}
              </div>
              
              {buylistsInStatus.length === 0 && (
                <div className="text-center py-8">
                  <StatusIcon className="w-8 h-8 mx-auto mb-2 opacity-50 text-gray-400" />
                  <p className="text-sm text-gray-500">No buylists</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BuylistBoard;