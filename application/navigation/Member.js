import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import MemberChat from '../screens/Chat'
import MemberProfile from '../screens/Profile'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ChatStack = createStackNavigator({
  MemberChat
}, config);
ChatStack.path = '';
ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'} />
  )
};

const ProfileStack = createStackNavigator({
  MemberProfile
}, config)
ProfileStack.path = '';
ProfileStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  )
};

const tabNavigator = createMaterialBottomTabNavigator({
  ChatStack,
  ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;
