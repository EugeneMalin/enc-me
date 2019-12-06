import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import Gamer from './Gamer';
import Member from './Member';
import Start from './Start';
import Transfer from './Transfer'

export default createAppContainer(
  createSwitchNavigator({
    Transfer,
    Start,
    Gamer,
    Member
  })
);