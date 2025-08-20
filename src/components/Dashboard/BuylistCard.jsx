import React, { useState } from 'react';
import { ChevronRight, ChevronDown, MoreVertical } from 'lucide-react';
import { STATUSES, formatTimeAgo } from '../../utils';

const BuylistCard = ({ 
  buylist, 
  onStatusChange, 
  onDragStart, 
  showStatusDropdown, 
  setShowStatusDropdown,
  setShowHistoryModal 
}) => {
  const [expandedBuylist, setExpandedBuylist] = useState(null);

  const totalCards = buylist.cards.reduce((sum, card) => sum + card.quantity, 0);
  const finalValue = buylist.finalValue || buylist.totalEstimatedValue;
  const isExpanded = expandedBuylist === buylist.id;
  const lastActivity = buylist.activityHistory ? buylist.activityHistory[buylist.activityHistory.length - 1] : null;
  const isDropdownOpen = showStatusDropdown === buylist.id;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-3">
      <div
        draggable={!isExpanded}
        onDragStart={(e) => !isExpanded && onDragStart(e, buylist)}
        className={`p-4 ${!isExpanded ? 'cursor-move hover:bg-gray-50' : ''} transition-colors`}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center">
              <button
                onClick={() => setExpandedBuylist(isExpanded ? null : buylist.id)}
                className="mr-2 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              <div>
                <h4 className="font-semibold text-gray-900">{buylist.customerName}</h4>
                <p className="text-sm text-gray-600">{buylist.customerEmail}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="text-right">
              <p className="text-sm font-medium text-green-600">${finalValue.toFixed(2)}</p>
              <p className="text-xs text-gray-500">{totalCards} cards</p>
            </div>
            
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowStatusDropdown(isDropdownOpen ? null : buylist.id);
                }}
                className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute right-0 top-8 z-20 w-48 bg-white rounded-lg shadow-lg border border-gray-200">
                  <div className="py-2">
                    <div className="px-3 py-2 text-xs font-medium text-gray-500">
                      Change Status
                    </div>
                    {STATUSES.map(status => {
                      const StatusIcon = status.icon;
                      const isCurrentStatus = buylist.status === status.key;
                      
                      return (
                        <button
                          key={status.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCurrentStatus) {
                              onStatusChange(buylist.id, status.key);
                            }
                          }}
                          disabled={isCurrentStatus}
                          className={`w-full px-3 py-2 text-left text-sm flex items-center space-x-2 transition-colors ${
                            isCurrentStatus
                              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                              : 'hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <div className={`w-3 h-3 rounded-full ${status.color} flex-shrink-0`}></div>
                          <StatusIcon className="w-4 h-4 flex-shrink-0" />
                          <span className="truncate">{status.title}</span>
                          {isCurrentStatus && (
                            <span className="text-xs ml-auto text-gray-400">Current</span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {!isExpanded && (
          <>
            <div className="space-y-1 mb-3">
              {buylist.cards.slice(0, 2).map(card => (
                <div key={card.id} className="text-xs text-gray-600">
                  {card.quantity}x {card.cardName} ({card.game})
                </div>
              ))}
              {buylist.cards.length > 2 && (
                <div className="text-xs text-gray-500">
                  +{buylist.cards.length - 2} more cards
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  STATUSES.find(s => s.key === buylist.status)?.color || 'bg-gray-400'
                }`}></div>
                <span className="text-xs font-medium text-gray-600">
                  {STATUSES.find(s => s.key === buylist.status)?.title || buylist.status}
                </span>
              </div>
              {lastActivity && (
                <span className="text-xs text-gray-500">
                  {formatTimeAgo(lastActivity.timestamp)}
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Submitted: {buylist.submissionDate}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowHistoryModal(buylist);
                }}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View History
              </button>
            </div>
            
            {buylist.notes && (
              <div className="mt-2 text-xs bg-gray-50 text-gray-600 rounded p-2">
                {buylist.notes}
              </div>
            )}
          </>
        )}
      </div>

      {isExpanded && (
        <div className="border-t border-gray-200 bg-gray-50 p-4">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <h5 className="font-semibold text-gray-800">Recent Activity</h5>
              <button
                onClick={() => setShowHistoryModal(buylist)}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View Full History
              </button>
            </div>
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {buylist.activityHistory?.slice(-3).reverse().map(activity => (
                <div key={activity.id} className="text-xs bg-white border border-gray-200 rounded p-2">
                  <div className="flex justify-between items-start">
                    <span className="font-medium">{activity.employee}</span>
                    <span className="text-gray-500">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>
                  <div className="text-gray-600">{activity.action}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Submitted:</span>
              <span className="ml-2 font-medium text-gray-900">{buylist.submissionDate}</span>
            </div>
            <div>
              <span className="text-gray-600">Last Modified:</span>
              <span className="ml-2 font-medium text-gray-900">{buylist.lastModifiedBy}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuylistCard;