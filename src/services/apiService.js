class APIService {
  constructor() {
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
    this.isProduction = process.env.NODE_ENV === 'production';
  }

  async request(endpoint, options = {}) {
    try {
      const url = this.isProduction ? `/api${endpoint}` : this.baseURL + endpoint;
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken') || 'mock-token'}`,
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  async getMockData() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve({
          buylists: [
            {
              id: 1,
              customerName: 'John Smith',
              customerEmail: 'john@email.com',
              submissionDate: '2025-08-01',
              status: 'Pending Receiving',
              totalEstimatedValue: 500.00,
              lastModifiedBy: 'Sarah Johnson',
              lastModifiedDate: '2025-08-01T10:30:00Z',
              activityHistory: [
                {
                  id: 1,
                  action: 'Imported from Storepass',
                  status: 'Pending Receiving',
                  employee: 'Sarah Johnson',
                  timestamp: '2025-08-01T10:30:00Z',
                  notes: 'Customer buylist imported from Storepass'
                }
              ],
              cards: [
                {
                  id: 101,
                  game: 'Magic: The Gathering',
                  cardName: 'Black Lotus',
                  set: 'Alpha',
                  condition: 'Near Mint',
                  estimatedPrice: 15000.00,
                  finalPrice: null,
                  quantity: 1,
                  rarity: 'Rare'
                }
              ],
              shopifyId: 'bl_001',
              storepassId: 'sp_001',
              notes: 'High value submission - handle with care'
            },
            {
              id: 2,
              customerName: 'Sarah Johnson',
              customerEmail: 'sarah@email.com',
              submissionDate: '2025-07-30',
              status: 'Received',
              totalEstimatedValue: 750.00,
              lastModifiedBy: 'Mike Wilson',
              lastModifiedDate: '2025-07-31T16:45:00Z',
              activityHistory: [
                {
                  id: 1,
                  action: 'Imported from Storepass',
                  status: 'Pending Receiving',
                  employee: 'System',
                  timestamp: '2025-07-30T09:15:00Z',
                  notes: 'Customer buylist imported'
                },
                {
                  id: 2,
                  action: 'Moved to Received',
                  status: 'Received',
                  employee: 'Mike Wilson',
                  timestamp: '2025-07-31T16:45:00Z',
                  notes: 'Cards received in good condition'
                }
              ],
              cards: [
                {
                  id: 201,
                  game: 'Pokemon',
                  cardName: 'Charizard',
                  set: 'Base Set',
                  condition: 'Near Mint',
                  estimatedPrice: 350.00,
                  finalPrice: null,
                  quantity: 1,
                  rarity: 'Holo Rare'
                }
              ],
              shopifyId: 'bl_002',
              storepassId: 'sp_002',
              notes: 'Pokemon collection - customer is a regular'
            }
          ],
          storepassBuylists: [
            {
              id: 'sp_pending_001',
              customerName: 'Alex Thompson',
              customerEmail: 'alex@email.com',
              submissionDate: new Date().toISOString().split('T')[0],
              storepassId: 'sp_pending_001',
              cards: [
                {
                  id: 'sp_card_001',
                  game: 'Magic: The Gathering',
                  cardName: 'Force of Will',
                  set: 'Alliances',
                  condition: 'Near Mint',
                  estimatedPrice: 85.00,
                  quantity: 2,
                  rarity: 'Uncommon'
                }
              ]
            }
          ]
        });
      }, 500);
    });
  }
}

export default APIService;