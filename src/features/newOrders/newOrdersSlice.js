import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

const newOrderURL = "http://localhost:3000/api/v1/orders"

const initialState = {
  total_amount: 0,
  tax_amount: 0,
  subtotal: 0,
  order_items: [],
  newOrderisSuccess: false,
  newOrderisError: false,
  newOrderErrorMessage: ''
}

const roundToTwo = (num) => {
  return +(Math.round(num + 'e+2')  + 'e-2');
}

export const createNewOrder = createAsyncThunk('posts/createNewOrder', async (newOrder, thunkAPI) => {
  const token = window.localStorage.getItem('token')  
  const configObj = {
    method: 'POST',
    headers: {
    'content-type': 'application/json',
    'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(newOrder)
  };

  try {
    const response = await fetch(newOrderURL, configObj)
    let data = await response.json();
    if (response.status === 201) {
      return data
    } else {
      return thunkAPI.rejectWithValue(data)
    }
  } catch (e) {
    thunkAPI.rejectWithValue(e.response.data)
  }
}) 

const newOrdersSlice = createSlice({
  name: 'newOrders',
  initialState, 
  reducers: {
    itemAdded: {
      reducer(state, action) {
        state.order_items.push(action.payload)
        state.subtotal = roundToTwo(state.subtotal + action.payload.price)
        state.tax_amount = roundToTwo((state.subtotal + action.payload.price) * 0.0875)
        state.total_amount = roundToTwo((state.subtotal + action.payload.price) * 1.0875)
      }
    },
    clearNewOrderStatus: {
      reducer(state, action) {
        state.newOrderisSuccess = false
        state.newOrderisError = false
        return state
      }
    }
  },
  extraReducers: {
    [createNewOrder.fulfilled]: (state, action) => {
      state.newOrderisSuccess = true
      state.total_amount = 0
      state.tax_amount = 0
      state.subtotal = 0
      state.order_items = []
      return state
    },
    [createNewOrder.rejected]: (state, action) => {
      state.newOrderisError = true
      state.newOrderErrorMessage = action.payload;
    }
  }  
})

export const { itemAdded, showItem, backToItemList, clearNewOrderStatus } = newOrdersSlice.actions

export default newOrdersSlice.reducer

export const newOrderSelector = state => state.newOrder;
