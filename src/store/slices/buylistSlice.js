import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// API calls
const buylistAPI = {
  async getBuylists(params = {}) {
    const token = localStorage.getItem('authToken');
    const response = await fetch('http://localhost:3001/api/buylists', {
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) throw new Error('Failed to fetch buylists');
    return await response.json();
  },

  async updateStatus(id, status, notes) {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`http://localhost:3001/api/buylists/${id}/status`, {
      method: 'PATCH',
      headers: { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status, notes })
    });
    
    if (!response.ok) throw new Error('Failed to update status');
    return await response.json();
  }
};

// Thunks
export const fetchBuylists = createAsyncThunk(
  'buylists/fetchBuylists',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await buylistAPI.getBuylists(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch buylists');
    }
  }
);

export const updateBuylistStatus = createAsyncThunk(
  'buylists/updateStatus',
  async ({ id, status, notes }, { rejectWithValue }) => {
    try {
      const response = await buylistAPI.updateStatus(id, status, notes);
      return response;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to update status');
    }
  }
);

// Slice
const buylistSlice = createSlice({
  name: 'buylists',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBuylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuylists.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.buylists || action.payload || [];
      })
      .addCase(fetchBuylists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBuylistStatus.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { clearError } = buylistSlice.actions;
export default buylistSlice.reducer;