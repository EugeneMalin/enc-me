import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import {Loading} from '../screens/Loading'


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const LoadingStack = createStackNavigator({
  Loading
}, config)

LoadingStack.path = '';

export default LoadingStack;
