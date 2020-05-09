import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { Image, Platform } from 'react-native';

// screens
import DashboardScreen from '../screens/DashboardScreen';
import ItemsScreen from '../screens/ItemsScreen';
import CartScreen from '../screens/CartScreen';
import ScheduleAppointmentScreen from '../screens/ScheduleAppointmentScreen'
// import PaymentScreen from '../screens/PaymentScreen';
import PaymentSelectionScreen from '../screens/PaymentSelectionScreen';
import DefaultStyles from '../style/customStyles';
import ProfileScreen from '../screens/ProfileScreen';
import AddAddressScreen from '../screens/AddAddressScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import ContactScreen from '../screens/ContactScreen';
import AboutScreen from '../screens/AboutScreen';
import SideDrawer from '../components/sideDrawer';
import AddressScreen from '../screens/AddressScreen';
import UpdateProfileScreen from '../screens/EditProfileScreen';
import HeaderRightView from '../components/headerRight';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AntDesign from 'react-native-vector-icons/AntDesign';

import ReferralScreen from '../screens/ReferralScreen';
import PackageScreen from '../screens/PackageScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ReviewOrderScreen from '../screens/ReviewOrderScreen';
import AppointmentPlaced from '../screens/AppointmentPlaced';
import OrderDetails from '../screens/OrderDetailsScreen';

const BackIcon = () => {
  if(Platform.OS == "ios") {
    return <Image source={require('../assets/icons/back-icon-ios@1.5.png')} style={{marginLeft: 15, width: 15, height: 15, tintColor: '#FFFFFF'}}/>
  } else {
    return <Image source={require('../assets/icons/back-icon@1.5.png')} style={{width: 30, height: 30, tintColor: '#FFFFFF'}}/>
  }
}

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
    // Payment: {
    //   screen: PaymentScreen
    // },
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
      headerTintColor: '#FFFFFF',
      headerBackImage: BackIcon,
      headerBackAllowFontScaling: true,
      headerTitleStyle: {
        fontWeight: 'bold',
        flex: 1
      },
      headerRight: () => <HeaderRightView navigation={navigation}/>
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
    headerTintColor: '#FFFFFF',
    headerBackImage: BackIcon,
    headerBackAllowFontScaling: true,
    headerTitleStyle: {
      fontWeight: 'bold',
      flex: 1
    },
    headerRight: () => <HeaderRightView navigation={navigation}/>
  })
})

const AddressStack = createStackNavigator({
  AddressListScreen: {
    screen: AddressScreen,
    navigationOptions: () => ({
      title: `Address`,
    }),
  },
  AddNewAddress: {
    screen: AddAddressScreen,
    navigationOptions: () => ({
      title: `Add Address`,
    }),
  }
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    headerStyle: DefaultStyles.brandBackgroundColor,
    headerTintColor: '#FFFFFF',
    headerBackImage: BackIcon,
    headerBackAllowFontScaling: true,
    headerTitleStyle: {
      fontWeight: 'bold',
      flex: 1
    },
    headerRight: () => <HeaderRightView navigation={navigation}/>
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
    screen: AddressStack,
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