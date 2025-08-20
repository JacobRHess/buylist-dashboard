import React, { useState } from 'react';
import { User, Upload, Settings, DollarSign, Package, Clock, Search, X } from 'lucide-react';
import { useAuth, useBuylists } from './hooks';
import { LoadingSpinner, ErrorDisplay } from './components/UI';
import { BuylistBoard } from './components/Dashboard';
import { ImportModal } from './components/Modals';
import { formatTimeAgo } from './utils';

function App() {
  const { currentUser, isAuthenticated, loading: authLoading, login } = useAuth();
  const { buylists, loading, error } = useBuylists();
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showImportModal, setShowImportModal] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner text="Loading dashboard..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold mb-4">Welcome to Buylist Dashboard</h1>
          <p className="mb-4">Click below to access the dashboard</p>
          <button
            onClick={() => login('demo', 'demo')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Demo Login
          </button>
        </div>
      </div>
    );
  }

  const filteredBuylists = buylists.filter(buylist => {
    const matchesSearch = buylist.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buylist.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buylist.cards.some(card => 
                           card.cardName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           card.set.toLowerCase().includes(searchTerm.toLowerCase())
                         );
    return matchesSearch;
  });

  const totalValue = buylists.reduce((sum, buylist) => sum + (buylist.finalValue || buylist.totalEstimatedValue), 0);
  const totalBuylists = buylists.length;
  const waitingPickup = buylists.filter(bl => bl.status === 'Still Waiting to Pick Up Check').length;

  return (
    <div className={`min-h-screen p-4 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-full mx-auto">
        {error && <ErrorDisplay error={error} />}
        
        {/* Header */}
        <div className={`rounded-lg shadow-sm p-4 mb-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Buylist Processing Board
              </h1>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                Track card submissions through authentication and processing
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-colors ${
                  darkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
              <div className="flex items-center">
                <User className={`w-4 h-4 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Logged in as: </span>
                <span className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {currentUser?.name || 'Demo User'}
                </span>
              </div>
              <button
                onClick={() => setShowImportModal(true)}
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Upload className="w-4 h-4 mr-2" />
                Import from Storepass
              </button>
              <div className="flex items-center px-3 py-2 bg-green-50 rounded-lg">
                <Settings className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-sm text-green-700">
                  Mock Mode - Ready for API Integration
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <DollarSign className="w-6 h-6 text-green-600" />
              <div className="ml-3">
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Pipeline Value</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>${totalValue.toLocaleString()}</p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <Package className="w-6 h-6 text-blue-600" />
              <div className="ml-3">
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Active Buylists</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{totalBuylists}</p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center">
              <Clock className="w-6 h-6 text-red-600" />
              <div className="ml-3">
                <p className={`text-xs font-medium ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>Awaiting Pickup</p>
                <p className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{waitingPickup}</p>
              </div>
            </div>
          </div>
          <div className={`rounded-lg shadow-sm p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="relative">
              <Search className={`w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
              <input
                type="text"
                placeholder="Search customers or cards..."
                className={`w-full pl-9 pr-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                    : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        <BuylistBoard 
          searchTerm={searchTerm}
          showStatusDropdown={showStatusDropdown}
          setShowStatusDropdown={setShowStatusDropdown}
          setShowHistoryModal={setShowHistoryModal}
        />
        
        <ImportModal 
          isOpen={showImportModal}
          onClose={() => setShowImportModal(false)}
        />

        {/* History Modal */}
        {showHistoryModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className={`rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            }`}>
              <div className={`p-6 border-b ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Activity History</h2>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {showHistoryModal.customerName} - {showHistoryModal.customerEmail}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(null)}
                    className={`${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {showHistoryModal.activityHistory?.map((activity, index) => {
                    const isLatest = index === showHistoryModal.activityHistory.length - 1;
                    
                    return (
                      <div key={activity.id} className="relative">
                        {index < showHistoryModal.activityHistory.length - 1 && (
                          <div className={`absolute left-4 top-8 w-0.5 h-full ${darkMode ? 'bg-gray-600' : 'bg-gray-200'}`}></div>
                        )}
                        
                        <div className="flex items-start space-x-4">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            isLatest 
                              ? 'bg-blue-100 border-2 border-blue-500' 
                              : darkMode 
                                ? 'bg-gray-700 border-2 border-gray-600' 
                                : 'bg-gray-100 border-2 border-gray-300'
                          }`}>
                            <div className={`w-2 h-2 rounded-full ${
                              isLatest ? 'bg-blue-500' : darkMode ? 'bg-gray-500' : 'bg-gray-400'
                            }`}></div>
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className={`rounded-lg p-4 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                              <div className="flex items-center justify-between mb-2">
                                <h4 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.action}</h4>
                                <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                                  {activity.status}
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between text-sm">
                                <span className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                  By <span className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{activity.employee}</span>
                                </span>
                                <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                  {new Date(activity.timestamp).toLocaleString()}
                                </span>
                              </div>
                              
                              {activity.notes && (
                                <div className={`mt-2 text-sm rounded border p-2 ${
                                  darkMode 
                                    ? 'bg-gray-800 border-gray-600 text-gray-300' 
                                    : 'bg-white border-gray-200 text-gray-700'
                                }`}>
                                  {activity.notes}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                
                <div className={`flex justify-end mt-6 pt-4 border-t ${darkMode ? 'border-gray-600' : 'border-gray-200'}`}>
                  <button
                    onClick={() => setShowHistoryModal(null)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      darkMode 
                        ? 'bg-gray-600 text-gray-200 hover:bg-gray-500' 
                        : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;