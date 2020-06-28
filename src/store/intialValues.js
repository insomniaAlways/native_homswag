import moment from 'moment';

export const auth = {
  isLoading: false,
  values: {},
  error: null
}

export const items = {
  isLoading: false,
  values: [],
  error: null
};

export const categories = {
  isLoading: false,
  values: [],
  error: null
};

export const cartItems = {
  isLoading: false,
  values: [],
  error: null
}

export const cart = {
  isLoading: false,
  paymentTypes: [
    { type: 1, title: "Pay Full" },
    { type: 2, title: "Pay custom" },
    { type: 3, title: "Pay After Service" }
  ],
  values: {
    item_total_price: 0,
    discount_amount: 0,
    taxes: 0,
    cart_total: 0,
    total_saved: 0,
    payment_types : 3
  },
  error: null
}

export const orders = {
  isLoading: false,
  values: [],
  currentValue: {},
  statusCode: [
    { id: 1, name: 'Appointment Placed', color: 'green' },
    { id: 2, name: 'Appointment Confirmed', color: 'green' },
    { id: 3, name: 'Appointment Canceled', color: 'red' },
    { id: 4, name: 'In Progress', color: 'rgb(52, 117, 211)' },
    { id: 5, name: 'Appointment Complete', color: 'rgb(52, 117, 211)' },
  ],
  error: null
}

export const addresses = {
  isLoading: false,
  values: [],
  error: null
}

export const packages = {
  isLoading: false,
  values: [],
  error: null
}

export const appointment = {
  isLoading: false,
  values: [],
  slot: 1,
  slots: [
    { type: 1, value: "9AM - 2PM", from: 9, to: 14 },
    { type: 2, value: "2PM - 7PM", from: 14, to: 19 },
    // { type: 3, value: "3PM - 6PM", from: 15, to: 18 }
  ],
  defaultValues: {
    from: moment().toDate(),
    date: moment().toDate(),
    selectedDate: moment().toDate(),
    slot: { type: 1, value: "9AM - 2PM", from: 9, to: 14 },
    appointment_for: null,
    phone_number: null,
    selectedAddress: null,
    special_instruction: '',
    prefered_beautician: ''
  },
  error: null
}

export const authModel = {
  isLoading: false,
  isSignOut: false,
  userToken: null,
  refreshToken: null,
  error: null
}

export const session = {
  isUpdating: false,
  isSessionExpired: false,
  isSessionAuthenticated: false,
  isSessionUnauthenticated: true,
  error: null
}

export const currentUser = {
  isLoading: false,
  values: {},
  error: null
}

export const networkAvailability = {
  isOffline: false,
}

export const rewards = {
  isLoading: false,
  error: null,
  values: {}
}

export const initialState = {
  items: items,
  categories: categories,
  cart: cart,
  cartItems: cartItems,
  orders: orders,
  addresses: addresses,
  packages: packages,
  appointment: appointment,
  session: session,
  currentUser: currentUser,
  networkAvailability: networkAvailability,
  rewards: rewards
}
