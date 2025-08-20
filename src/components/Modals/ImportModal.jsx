import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';
import { LoadingSpinner } from '../UI';
import { storepassService } from '../../services';
import { useBuylists, useAuth } from '../../hooks';

const ImportModal = ({ isOpen, onClose }) => {
  const [storepassBuylists, setStorepassBuylists] = useState([]);
  const [loading, setLoading] = useState(false);
  const { importFromStorepass } = useBuylists();
  const { currentUser } = useAuth();

  const fetchStorepassBuylists = async () => {
    try {
      setLoading(true);
      const pendingBuylists = await storepassService.getPendingBuylists();
      setStorepassBuylists(pendingBuylists);
    } catch (error) {
      console.error('Failed to fetch Storepass buylists:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (buylist) => {
    try {
      await importFromStorepass(buylist, currentUser?.name || 'Unknown');
      setStorepassBuylists(prev => prev.filter(bl => bl.id !== buylist.id));
    } catch (error) {
      console.error('Import failed:', error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchStorepassBuylists();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Import Buylists from Storepass</h2>
              <p className="text-gray-600">Select customer buylists to import into your processing pipeline</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          {loading ? (
            <LoadingSpinner />
          ) : storepassBuylists.length === 0 ? (
            <div className="text-center py-12">
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium mb-2 text-gray-900">No Pending Buylists</h3>
              <p className="text-gray-600">No customer buylists are currently pending in Storepass.</p>
              <button
                onClick={fetchStorepassBuylists}
                className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Refresh
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {storepassBuylists.map(buylist => {
                const totalValue = buylist.cards.reduce((sum, card) => 
                  sum + (card.estimatedPrice * card.quantity), 0
                );
                const totalCards = buylist.cards.reduce((sum, card) => sum + card.quantity, 0);
                
                return (
                  <div key={buylist.id} className="border border-gray-200 hover:border-purple-300 rounded-lg p-4 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{buylist.customerName}</h4>
                        <p className="text-sm text-gray-600">{buylist.customerEmail}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-green-600">${totalValue.toFixed(2)}</p>
                        <p className="text-sm text-gray-500">{totalCards} cards</p>
                        <button
                          onClick={() => handleImport(buylist)}
                          className="mt-2 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                        >
                          Import
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;