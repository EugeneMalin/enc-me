import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Gamer from './Gamer';
import Member from './Member';
import Start from './Start';

export default createAppContainer(
  createSwitchNavigator({
    Start,
    Gamer,
    Member
  }, {
    initialRouteName: 'Start',
  })
);