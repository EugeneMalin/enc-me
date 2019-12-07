import { AppLoading } from 'expo';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React from 'react';
import { Platform, StatusBar, StyleSheet, View } from 'react-native';
import FlashMessage from "react-native-flash-message";
import AppNavigation from './navigation/App';
import { Provider } from 'react-redux';
import store from './store'
import FlashButton from './components/FlashButton';
import { Provider as PaperProvider } from 'react-native-paper';
import { withTheme } from 'react-native-paper';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    console.log("app created");
    store.subscribe(() => {
      console.log(store.getState()["theme"]);
      this.setState({
        theme: store.getState()["theme"]
      })
    })
  }
  state = { theme: store.getState()["theme"] }
  render() {
    return (
      <View style={{ flex: 1 }}  >
        {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        < Provider store={store} >
          <PaperProvider theme={this.state.theme} >
            <AppNavigation theme={'dark'} />
          </PaperProvider>
        </Provider>
        <FlashButton />
        <FlashMessage position="top" />
      </View >
    )
  };
}