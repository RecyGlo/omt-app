import React from 'react';
import {Provider} from 'react-redux';
import {Button, Alert, Linking} from 'react-native';
import createAppStore from './redux/store';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import analytics from '@react-native-firebase/analytics';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

import Login from './screen/login';
import Splash from './screen/splash';
import Setting from './screen/setting';
import AddProfile from './screen/addProfile';
import EditProfile from './screen/editProfile';
import PinNewLocation from './screen/pinNewLocation';
import LocationScreen from './screen/LocationScreen';
import PrivacyPolicy from './screen/privacyPolicy';
import TermsAndConditions from './screen/termsAndConditions';
import ContactUs from './screen/contactUs';

//Item
import Item from './screen/item/item';
import ItemDetail from './screen/item/itemDetail';
import AddItem from './screen/item/addItem';
import EditItem from './screen/item/editItem';

// Junk Shop
import JunkShop from './screen/junkShop/junkShop';
import AddJunkShop from './screen/junkShop/addJunkShop';
import EditJunkShop from './screen/junkShop/editJunkShop';
import JunkShopAddedList from './screen/junkShop/junkShopAddedList';
import JunkShopDetail from './screen/junkShop/junkShopDetail';
import PinJunkShopLocation from './screen/junkShop/pinJunkShopLocation';
import AdminJunkShop from './screen/junkShop/adminJunkShop';

// //News
import News from './screen/news/news';
import NewsDetail from './screen/news/newsDetail';
import AddNews from './screen/news/addNews';
import EditNews from './screen/news/editNews';

// Recycling
import RecyclingMain from './screen/recycling/recyclingMain';
import ScanScreen from './screen/recycling/ScanScreen';
import WalletScreen from './screen/recycling/walletScreen';
import ReverseVendingScreen from './screen/recycling/reverseVendingScreen';

// notification
import Notification from './screen/notification/notification';
import NotificationDetail from './screen/notification/notificationDetail';

// contact
import Contact from './screen/contact/contact';
// import AdminContact from './screen/contact/adminContact';
// import AddContact from './screen/contact/addContact';

// market place
import MarketPlace from './screen/marketPlace/marketPlace';
import MarketPlaceDashboard from './screen/marketPlace/marketPlaceDashboard';
import MarketPlaceDashboardDetail from './screen/marketPlace/marketPlaceDashboardDetail';
import MarketPlaceCart from './screen/marketPlace/marketPlaceCart';
import MarketPlaceMessage from './screen/marketPlace/marketPlaceMessage';
import MarketPlaceDiscussion from './screen/marketPlace/marketPlaceDiscussion';
import marketPlaceNotification from './screen/marketPlace/marketPlaceNotification';
import AddMarketPlace from './screen/marketPlace/addMarketPlace';
import MarketPlaceDetail from './screen/marketPlace/marketPlaceDetail';
import MarketPlaceSavedList from './screen/marketPlace/marketPlaceSavedList';
import MarketPlaceUploadedList from './screen/marketPlace/marketPlaceUploadedList';
import MarketPlaceProfile from './screen/marketPlace/marketPlaceProfile';
import MarketPlaceOrderedList from './screen/marketPlace/marketPlaceOrderedList';
import MarketPlaceOrderedAcceptedList from './screen/marketPlace/marketPlaceOrderedAcceptedList';
import MyMarketPlaceOrderedList from './screen/marketPlace/myMarketPlaceOrderedList';
import MyMarketPlaceOrderedAcceptedList from './screen/marketPlace/myMarketPlaceOrderedAcceptedList';
import MyMarketPlaceOrderedDetail from './screen/marketPlace/myMarketPlaceOrderedDetail';
import EditMarketPlace from './screen/marketPlace/editMarketPlace';

import Icon from 'react-native-vector-icons/AntDesign';
import MapIcon from 'react-native-vector-icons/Feather';
import RecycleIcon from 'react-native-vector-icons/FontAwesome';
import SettingIcon from 'react-native-vector-icons/AntDesign';
import NewsIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ShopIcon from 'react-native-vector-icons/Entypo';

export function UserSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="AddProfile"
        component={AddProfile}
        options={{
          title: 'Open Account',
          headerStyle: {backgroundColor: '#f09839'},
        }}
      />
    </Stack.Navigator>
  );
}

export function HomeSetUp() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="MarketPlace" component={MarketPlaceSetUp} options={{ headerShown: false, }} /> */}
      <Stack.Screen
        name="Recycling"
        component={RecyclingSetUp}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

export function BottomTab() {
  return (
    <Tab.Navigator
      initialRouteName="Recycling"
      tabBarOptions={{
        activeTintColor: '#f09839',
        inactiveTintColor: '#000',
        keyboardHidesTabBar: true,
        labelStyle: {fontSize: 12},
      }}>
      <Tab.Screen
        name="Recycling"
        component={RecyclingSetUp}
        options={{
          tabBarLabel: 'Recycling',
          tabBarIcon: ({color, size}) => (
            <RecycleIcon name="recycle" color={color} size={20} />
          ),
        }}
      />
      {/* <Tab.Screen name="Item" component={ItemSetUp}
        options={{
          tabBarLabel: 'Item',
          tabBarIcon: ({ color, size }) => (
            <Icon name="home" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen name="JunkShop" component={JunkShopSetUp}
        options={{
          tabBarLabel: 'Junk Shop',
          tabBarIcon: ({ color, size }) => (
            <MapIcon name="map-pin" color={color} size={20} />
          ),
        }}
      /> */}
      {/* <Tab.Screen name="MarketPlace" component={MarketPlace}
        options={{
          tabBarLabel: 'Marketplace',
          tabBarIcon: ({ color, size }) => (
            <ShopIcon name="shop" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen name="News" component={NewsSetUp}
        options={{
          tabBarLabel: 'News',
          tabBarIcon: ({ color, size }) => (
            <NewsIcon name="newspaper" color={color} size={20} />
          ),
        }}
      />
      <Tab.Screen name="Setting" component={SettingSetUp}
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color, size }) => (
            <SettingIcon name="setting" color={color} size={20} />
          ),
        }}
      /> */}
    </Tab.Navigator>
  );
}

function ItemSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Item"
        component={Item}
        options={{
          title: 'Recyclable Item',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: 'Item Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={{
          title: 'Add Item',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={{
          title: 'Edit Item',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

function JunkShopSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="JunkShop"
        component={JunkShop}
        options={{
          title: 'Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddJunkShop"
        component={AddJunkShop}
        options={{
          title: 'Add Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditJunkShop"
        component={EditJunkShop}
        options={{
          title: 'Edit Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AdminJunkShop"
        component={AdminJunkShop}
        options={{
          title: 'Admin Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="JunkShopAddedList"
        component={JunkShopAddedList}
        options={{
          title: 'Junk Shop Added List',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="JunkShopDetail"
        component={JunkShopDetail}
        options={{
          title: 'Junk Shop Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PinJunkShopLocation"
        component={PinJunkShopLocation}
        options={{
          title: 'Pin Junk Shop Location',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

function NewsSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="News"
        component={News}
        options={{
          title: 'News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetail}
        options={{
          title: 'News Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddNews"
        component={AddNews}
        options={{
          title: 'Add News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditNews"
        component={EditNews}
        options={{
          title: 'Edit News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

function MarketPlaceSetUp() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="MarketPlace" component={BottomTab} options={{ headerShown: false }} /> */}
      <Stack.Screen
        name="MarketPlaceDashboard"
        component={MarketPlaceDashboard}
        options={{
          title: 'Dashboard',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDashboardDetail"
        component={MarketPlaceDashboardDetail}
        options={{
          title: 'Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceCart"
        component={MarketPlaceCart}
        options={{
          title: 'Cart',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceMessage"
        component={MarketPlaceMessage}
        options={{
          title: 'Message',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDiscussion"
        component={MarketPlaceDiscussion}
        options={{
          title: 'Message',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceNotification"
        component={marketPlaceNotification}
        options={{
          title: 'Notification',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddMarketPlace"
        component={AddMarketPlace}
        options={{
          title: 'Add Your Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDetail"
        component={MarketPlaceDetail}
        options={{
          title: 'Product Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceSavedList"
        component={MarketPlaceSavedList}
        options={{
          title: 'Saved Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceUploadedList"
        component={MarketPlaceUploadedList}
        options={{
          title: 'Uploaded Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceProfile"
        component={MarketPlaceProfile}
        options={{
          title: 'Product List',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceOrderedList"
        component={MarketPlaceOrderedList}
        options={{
          title: 'Ordered Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceOrderedAcceptedList"
        component={MarketPlaceOrderedAcceptedList}
        options={{
          title: 'Order Accepted Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedList"
        component={MyMarketPlaceOrderedList}
        options={{
          title: 'My Product Ordered',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedAcceptedList"
        component={MyMarketPlaceOrderedAcceptedList}
        options={{
          title: 'My Sold Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedDetail"
        component={MyMarketPlaceOrderedDetail}
        options={{
          title: 'My Product Ordered Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditMarketPlace"
        component={EditMarketPlace}
        options={{
          title: 'Edit Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

function RecyclingSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Recycling"
        component={RecyclingMain}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="ScanScreen"
        component={ScanScreen}
        options={{
          headerShown: true,
          title: 'Scan QR Code',
          headerTintColor: '#fff',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {color: '#ffffff'},
        }}
      />
      <Stack.Screen
        name="WalletScreen"
        component={WalletScreen}
        options={{
          headerShown: true,
          title: 'Digital Wallet',
          headerTintColor: '#fff',
          headerStyle: {
            backgroundColor: '#f09839',
            shadowOpacity: 0,
            elevation: 0,
          },
          headerTitleStyle: {color: '#ffffff'},
          headerRight: () => (
            <MaterialCommunityIcon
              // onPress={() => alert('Please contact +959795001789 for more information.')}
              onPress={() => Alert.alert(
                'For more information',
                'Please contact +959795001789 or toe@recyglo.com.',)}
              name="information-variant"
              color="#ffffff"
              size={40}
              style={{
                flex: 1,
                alignContent: 'flex-end',
                lineHeight: 50,
                textAlign: 'right',
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="ReverseVending"
        component={ReverseVendingScreen}
        options={{
          headerShown: true,
          title: null,
          headerTintColor: '#ffffff',
          headerStyle: {
            backgroundColor: '#f09839',
            elevation: 0, // remove shadow on Android
            shadowOpacity: 0,
          },
        }}
      />

      {/* Item */}
      <Stack.Screen
        name="Item"
        component={Item}
        options={{
          title: 'Recyclable Item',
          headerTintColor: '#ffffff',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700', color: '#ffffff'},
        }}
      />
      <Stack.Screen
        name="ItemDetail"
        component={ItemDetail}
        options={{
          title: 'Item Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddItem"
        component={AddItem}
        options={{
          title: 'Add Item',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditItem"
        component={EditItem}
        options={{
          title: 'Edit Item',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />

      {/* Junk Shops */}
      <Stack.Screen
        name="JunkShop"
        component={JunkShop}
        options={{
          title: 'Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddJunkShop"
        component={AddJunkShop}
        options={{
          title: 'Add Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditJunkShop"
        component={EditJunkShop}
        options={{
          title: 'Edit Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AdminJunkShop"
        component={AdminJunkShop}
        options={{
          title: 'Admin Junk Shop',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="JunkShopAddedList"
        component={JunkShopAddedList}
        options={{
          title: 'Junk Shop Added List',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="JunkShopDetail"
        component={JunkShopDetail}
        options={{
          title: 'Junk Shop Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PinJunkShopLocation"
        component={PinJunkShopLocation}
        options={{
          title: 'Pin Junk Shop Location',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />

      {/* News */}
      <Stack.Screen
        name="News"
        component={News}
        options={{
          title: 'News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="NewsDetail"
        component={NewsDetail}
        options={{
          title: 'News Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddNews"
        component={AddNews}
        options={{
          title: 'Add News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditNews"
        component={EditNews}
        options={{
          title: 'Edit News',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />

      {/* Market Place */}
      <Stack.Screen
        name="MarketPlace"
        component={MarketPlace}
        options={{headerShown: false}}
        // options={{
        //   title: 'Market Place',
        //   headerStyle: {backgroundColor: '#f09839'},
        //   headerTitleStyle: {fontWeight: '700', color: '#ffffff'},
        // }}
      />
      <Stack.Screen
        name="MarketPlaceDashboard"
        component={MarketPlaceDashboard}
        options={{
          title: 'Dashboard',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDashboardDetail"
        component={MarketPlaceDashboardDetail}
        options={{
          title: 'Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceCart"
        component={MarketPlaceCart}
        options={{
          title: 'Cart',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceMessage"
        component={MarketPlaceMessage}
        options={{
          title: 'Message',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDiscussion"
        component={MarketPlaceDiscussion}
        options={{
          title: 'Message',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceNotification"
        component={marketPlaceNotification}
        options={{
          title: 'Notification',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="AddMarketPlace"
        component={AddMarketPlace}
        options={{
          title: 'Add Your Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceDetail"
        component={MarketPlaceDetail}
        options={{
          title: 'Product Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceSavedList"
        component={MarketPlaceSavedList}
        options={{
          title: 'Saved Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceUploadedList"
        component={MarketPlaceUploadedList}
        options={{
          title: 'Uploaded Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceProfile"
        component={MarketPlaceProfile}
        options={{
          title: 'Product List',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceOrderedList"
        component={MarketPlaceOrderedList}
        options={{
          title: 'Ordered Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MarketPlaceOrderedAcceptedList"
        component={MarketPlaceOrderedAcceptedList}
        options={{
          title: 'Order Accepted Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedList"
        component={MyMarketPlaceOrderedList}
        options={{
          title: 'My Product Ordered',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedAcceptedList"
        component={MyMarketPlaceOrderedAcceptedList}
        options={{
          title: 'My Sold Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="MyMarketPlaceOrderedDetail"
        component={MyMarketPlaceOrderedDetail}
        options={{
          title: 'My Product Ordered Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="EditMarketPlace"
        component={EditMarketPlace}
        options={{
          title: 'Edit Product',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      {/* <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: 'Edit Profile', headerStyle: { backgroundColor: '#f09839', }, headerTitleStyle: { fontWeight: '700', }, }} /> */}

      {/* Settings */}
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PinNewLocation"
        component={PinNewLocation}
        options={{
          title: 'Pin New Location',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="LocationScreen"
        component={LocationScreen}
        options={{
          title: 'Location',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{
          title: 'Notification Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          title: 'Emergency Contact',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          title: 'Privacy Policy',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          title: 'Terms And Conditions',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          title: 'Contact Us',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

function SettingSetUp() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PinNewLocation"
        component={PinNewLocation}
        options={{
          title: 'Pin New Location',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="Notification"
        component={Notification}
        options={{
          title: 'Notification',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="NotificationDetail"
        component={NotificationDetail}
        options={{
          title: 'Notification Detail',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="Contact"
        component={Contact}
        options={{
          title: 'Emergency Contact',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{
          title: 'Privacy Policy',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="TermsAndConditions"
        component={TermsAndConditions}
        options={{
          title: 'Terms And Conditions',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
      <Stack.Screen
        name="ContactUs"
        component={ContactUs}
        options={{
          title: 'Contact Us',
          headerStyle: {backgroundColor: '#f09839'},
          headerTitleStyle: {fontWeight: '700'},
        }}
      />
    </Stack.Navigator>
  );
}

const initialState = {};
const store = createAppStore(initialState);

export default class App extends React.Component {
  routeNameRef = React.createRef();
  navigationRef = React.createRef();

  render() {
    return (
      <Provider store={store}>
        <SafeAreaProvider>
          <NavigationContainer
            ref={this.navigationRef}
            onStateChange={() => {
              const previousRouteName = this.routeNameRef.current;
              const currentRouteName = this.navigationRef.current.getCurrentRoute()
                .name;

              if (previousRouteName !== currentRouteName) {
                console.log(currentRouteName);
                const screen = {
                  screen_class: currentRouteName,
                  screen_name: currentRouteName,
                };
                analytics().logScreenView(screen);
              }
              this.routeNameRef.current = currentRouteName;
            }}>
            <Splash />
          </NavigationContainer>
        </SafeAreaProvider>
      </Provider>
    );
  }
}
