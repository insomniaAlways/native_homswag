import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';

// screens
import DashboardScreen from '../src/screens/DashboardScreen';
import ItemsScreen from '../src/screens/ItemsScreen';
import CartScreen from '../src/screens/CartScreen';
import ScheduleAppointmentScreen from '../src/screens/ScheduleAppointmentScreen'
import PaymentScreen from '../src/screens/PaymentScreen';
import PaymentSelectionScreen from '../src/screens/PaymentSelectionScreen';
import DefaultStyles from '../src/style/customStyles';
import ProfileScreen from '../src/screens/ProfileScreen';
import AddAddressScreen from '../src/screens/AddAddressScreen';
import OrderHistoryScreen from '../src/screens/OrderHistoryScreen';
import ContactScreen from '../src/screens/ContactScreen';
import AboutScreen from '../src/screens/AboutScreen';
import SideDrawer from '../src/components/sideDrawer';
import AddressScreen from '../src/screens/AddressScreen';
import UpdateProfileScreen from '../src/screens/EditProfileScreen';
import HeaderRightView from '../src/components/headerRight';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ReferralScreen from '../src/screens/ReferralScreen';
import PackageScreen from '../src/screens/PackageScreen';
import LoginScreen from '../src/screens/auth/LoginScreen';
import ReviewOrderScreen from '../src/screens/ReviewOrderScreen';
import AppointmentPlaced from '../src/screens/AppointmentPlaced';
import OrderDetails from '../src/screens/OrderDetailsScreen';

const AppNavigator = createStackNavigator({
    Dashboard: {
      screen: DashboardScreen
    },
    Items: {
      screen: ItemsScreen,
    },
    Packages: {
      screen: PackageScreen,
    },
    Cart: {
      screen: CartScreen,
    },
    BookAppointment: { 
      screen: ScheduleAppointmentScreen,
      navigationOptions: () => ({
        title: `Book Appointment`,
      }),
    },
    SelectPaymentType: {
      screen: PaymentSelectionScreen,
      navigationOptions: () => ({
        title: `Payment Type`,
      }),
    },
    Payment: {
      screen: PaymentScreen
    },
    
    AddAddress: {
      screen: AddAddressScreen,
      navigationOptions: () => ({
        title: `Add Address`,
      }),
    },

    ConfirmAppointment: {
      screen: ReviewOrderScreen,
      headerMode: 'none',
      navigationOptions: {
        headerShown: false
      }
    },

    OrderComplete: {
      screen: AppointmentPlaced,
      headerMode: 'none',
      navigationOptions: {
        headerShown: false
      }
    }
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      title: navigation.state.routeName,
      headerStyle: DefaultStyles.brandBackgroundColor,
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        flex: 1
      },
      headerRight: <HeaderRightView navigation={navigation}/>
    })
  }
);

const OrderStackNavigator = createStackNavigator({
  OrderList: {
    screen: OrderHistoryScreen,
    navigationOptions: () => ({
      title: `Appointments`,
    }),
  },
  OrderDetails: {
    screen: OrderDetails,
    navigationOptions: () => ({
      title: `Appointment Detials`,
    }),
  }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: DefaultStyles.brandBackgroundColor,
    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
      flex: 1
    },
    headerRight: <HeaderRightView navigation={navigation}/>
  })
})


const DrawerNavigation = createDrawerNavigator({
  Dashboard: {
    screen: AppNavigator,
    navigationOptions: ({tintColor}) => {
      return {
        drawerIcon: <MaterialCommunityIcons name="monitor-dashboard" size={18} color={tintColor}/>,
        unmountInactiveRoutes: true
      }
    }
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: ({tintColor}) => {
      return {
        drawerIcon: <AntDesign name="profile" size={18} color={tintColor}/>
      }
    }
  },
  Address: {
    screen: AddressScreen,
    navigationOptions: ({tintColor}) => {
      return {
        drawerIcon: <FontAwesome name="address-book-o" size={18} color={tintColor}/>
      }
    }
  },
  Orders: { 
    screen: OrderStackNavigator,
    navigationOptions: ({tintColor}) => {
      return {
        title: `Appointments`,
        drawerIcon: <FontAwesome name="reorder" size={18} color={tintColor}/>
      }
    }
  },
  // Referral: { 
  //   screen: ReferralScreen,
  //   navigationOptions: ({tintColor}) => {
  //     return {
  //       drawerIcon: <FontAwesome name="slideshare" size={18} color={tintColor}/>
  //     }
  //   }
  // },
  About: {
    screen: AboutScreen,
    navigationOptions: ({tintColor}) => ({
      title: `About Us`,
      drawerIcon: <FontAwesome name="home" size={18} color={tintColor}/>
    }),
  }
}, { contentComponent: SideDrawer, unmountInactiveRoutes: true });

const switchNavigation = createSwitchNavigator({
  Auth: {
    screen: LoginScreen
  },
  ProfileUpdate: {
    screen: UpdateProfileScreen
  },
  App: {
    screen: DrawerNavigation
  }
})


export default createAppContainer(switchNavigation);