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
import { DarkTheme, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

export default function App(props) {
  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
        <Provider store={store}>
          <AppNavigation/>
        </Provider>
      <FlashButton/>
      <FlashMessage position="top" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});
