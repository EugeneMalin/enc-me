import React from 'react';
import {
  ActivityIndicator,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';

import { Drawer, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';


class Loading extends React.Component {
  // Render any loading content that you like here
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle="default" />
        </View>
      </Drawer.Section>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Loading));