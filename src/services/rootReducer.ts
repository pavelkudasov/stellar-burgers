import { combineReducers } from '@reduxjs/toolkit';

import burgerReducer from './slices/burgerSlice';
import feedReducer from './slices/feedSlice';
import ingredientsReducer from './slices/ingredientsSlice';
import orderReducer from './slices/orderSlice';
import userReducer from './slices/userSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burger: burgerReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer,
});
