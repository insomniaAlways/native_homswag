import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import itemReducers from './reducers/itemReducers';
import categoryReducers from './reducers/categoryReducers';
import authReducers from './reducers/authenticationReducer';
import cartReducers from './reducers/cartReducers';
import cartItemReducers from './reducers/cartItemReducers';
import orderReducers from './reducers/orderReducers';
import addressReducers from './reducers/addressReducers';
import packageReducers from './reducers/packageReducers';
import appointmentReducers from './reducers/appointmentReducers';
import sessionReducers from './reducers/sessionReducers';
import locationReducers from './reducers/locationReducers';
import userReducers from './reducers/userReducers';
import networkReducers from './reducers/networkReducers';

import thunk from 'redux-thunk';
import rewardReducers from './reducers/reward.reducer';

const rootReducer = combineReducers({
  items: itemReducers,
  categories: categoryReducers,
  auth: authReducers,
  cart: cartReducers,
  cartItems: cartItemReducers,
  orders: orderReducers,
  addresses: addressReducers,
  packages: packageReducers,
  location: locationReducers,
  appointment: appointmentReducers,
  currentUser: userReducers,
  networkAvailability: networkReducers,
  session: sessionReducers,
  rewards: rewardReducers
})

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middleware = [thunk];

const store = createStore(rootReducer, composeEnhancers(applyMiddleware(...middleware)))

export default store;