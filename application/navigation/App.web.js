import { createBrowserApp } from '@react-navigation/web';
import { createSwitchNavigator } from 'react-navigation';

import Gamer from './Gamer';
import Start from './Start';
import Member from './Member';

const switchNavigator = createSwitchNavigator({
  Start,
  Gamer,
  Member
}, {
  initialRouteName: 'Start',
});
switchNavigator.path = '';

export default createBrowserApp(switchNavigator, { history: 'hash' });
