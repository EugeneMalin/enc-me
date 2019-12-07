import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import Chat from '../screens/Chat'
import Question from '../screens/Question'
import Map from '../screens/Map'
import GamerProfile from '../screens/Profile'
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import { withTheme } from 'react-native-paper';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const ChatStack = createStackNavigator({
  Chat
}, config);
ChatStack.path = '';
ChatStack.navigationOptions = {
  tabBarLabel: 'Chat',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-people' : 'md-people'} />
  )
};

const QuestionStack = createStackNavigator({
  Question
}, config)
QuestionStack.path = '';
QuestionStack.navigationOptions = {
  tabBarLabel: 'Game',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-listbox' : 'md-list-box'} />
  )
};

const MapStack = createStackNavigator({
  Map
}, config)
MapStack.path = '';
MapStack.navigationOptions = {
  tabBarLabel: 'Map',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-map' : 'md-map'} />
  )
};

const ProfileStack = createStackNavigator({
  GamerProfile
}, config)
ProfileStack.path = '';
ProfileStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-person' : 'md-person'} />
  )
};

const tabNavigator = createMaterialBottomTabNavigator({
  QuestionStack,
  ChatStack,
  MapStack,
  ProfileStack
});

tabNavigator.path = '';

export default tabNavigator;
