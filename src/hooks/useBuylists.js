import { useState, useEffect } from 'react';
import { storepassService, shopifyService, apiService } from '../services';

export const useBuylists = () => {
  const [buylists, setBuylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBuylists = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Replace with real API call
      // const data = await apiService.request('/buylists');
      
      const mockData = await apiService.getMockData();
      setBuylists(mockData.buylists);
    } catch (err) {
      setError('Failed to load buylists');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBuylistStatus = async (buylistId, newStatus, employee) => {
    try {
      const updatedBuylists = buylists.map(buylist => {
        if (buylist.id === buylistId) {
          const updatedBuylist = { 
            ...buylist, 
            status: newStatus,
            lastModifiedBy: employee,
            lastModifiedDate: new Date().toISOString()
          };
          
          const newActivity = {
            id: Date.now(),
            action: `Status changed to ${newStatus}`,
            status: newStatus,
            employee: employee,
            timestamp: new Date().toISOString(),
            notes: `Status manually changed from ${buylist.status} to ${newStatus}`
          };
          
          updatedBuylist.activityHistory = [...(buylist.activityHistory || []), newActivity];
          
          if (newStatus === 'Recently Done' && !buylist.completedDate) {
            updatedBuylist.completedDate = new Date().toISOString().split('T')[0];
          }
          
          // Sync with external services
          storepassService.updateBuylistStatus(buylist.storepassId, newStatus);
          shopifyService.updateInventory(buylist.cards);
          
          return updatedBuylist;
        }
        return buylist;
      });
      
      setBuylists(updatedBuylists);
      
      // TODO: Save to database
      // await apiService.request(`/buylists/${buylistId}`, {
      //   method: 'PATCH',
      //   body: JSON.stringify({ status: newStatus })
      // });
      
    } catch (err) {
      setError('Failed to update buylist status');
      console.error(err);
    }
  };

  const importFromStorepass = async (storepassBuylist, employee) => {
    try {
      const totalEstimatedValue = storepassBuylist.cards.reduce((sum, card) => 
        sum + (card.estimatedPrice * card.quantity), 0
      );

      const newBuylist = {
        id: Date.now(),
        customerName: storepassBuylist.customerName,
        customerEmail: storepassBuylist.customerEmail,
        submissionDate: storepassBuylist.submissionDate,
        status: 'Pending Receiving',
        totalEstimatedValue: totalEstimatedValue,
        lastModifiedBy: employee,
        lastModifiedDate: new Date().toISOString(),
        activityHistory: [
          {
            id: 1,
            action: 'Imported from Storepass',
            status: 'Pending Receiving',
            employee: employee,
            timestamp: new Date().toISOString(),
            notes: 'Customer buylist imported from Storepass system'
          }
        ],
        cards: storepassBuylist.cards.map(card => ({
          ...card,
          finalPrice: null
        })),
        shopifyId: `bl_${Date.now()}`,
        storepassId: storepassBuylist.storepassId,
        notes: 'Imported from Storepass - awaiting physical cards'
      };

      setBuylists(prev => [...prev, newBuylist]);
      
      // Mark as imported in Storepass
      await storepassService.importBuylist(storepassBuylist.id);
      
      // TODO: Save to database
      // await apiService.request('/buylists', {
      //   method: 'POST',
      //   body: JSON.stringify(newBuylist)
      // });
      
      return newBuylist;
    } catch (err) {
      setError('Failed to import from Storepass');
      console.error(err);
      throw err;
    }
  };

  useEffect(() => {
    loadBuylists();
  }, []);

  return {
    buylists,
    loading,
    error,
    updateBuylistStatus,
    importFromStorepass,
    refresh: loadBuylists
  };
};