import { createStackNavigator } from "react-navigation";
import { Platform } from 'react-native';
import {SignIn} from "../screens/SignIn";

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const SingedOut = createStackNavigator({
  SignIn: {
    screen: SignIn
  }
}, config);

SingedOut.path = ''

export default SingedOut
