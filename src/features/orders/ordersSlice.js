import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const initialState = {
  orders: [],
  status: 'idle',
  error: null
}

export const fetchOrders = createAsyncThunk('orders/fetchOrders', async () => {
  const token = window.localStorage.getItem('token')
  const response = fetch('http://localhost:3000/api/v1/orders', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then(res => res.json())
  .then(response => response.orders)
  .catch(response => response.error);

  return response
})

const ordersSlice = createSlice({
  name: 'orders',
  initialState, 
  reducers: {
    resetStatus: {
      reducer(state, action) {
        state.status = 'idle'
      }
    }
  },
  extraReducers: {
    [fetchOrders.fulfilled]: (state, action) => {
      state.orders = action.payload
      state.status = 'succeeded'
    }
  }
  
})

export const { resetStatus } = ordersSlice.actions

export default ordersSlice.reducer

export const selectAllOrders = state => state.orders.orders

export const selectOrderById = (state, orderId) =>
  state.orders.orders.find(order => String(order.id) === orderId)
