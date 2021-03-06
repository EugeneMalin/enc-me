import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';

import Gamer from './Gamer';
import Start from './Start';
import Transfer from './Transfer'
import Member from './Member';

const switchNavigator = createSwitchNavigator({
  Transfer,
  Start,
  Gamer,
  Member
}, {
  initialRouteName: 'Transfer',
});
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
