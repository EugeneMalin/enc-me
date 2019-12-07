import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Layout from '../constants/Layout';
import { connect } from 'react-redux';
import { Drawer, withTheme } from 'react-native-paper';

function Header(props) {
  return (
    <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
      <View style={styles.container}>
          <Text style={styles.header}>{props.user && props.user.gameId ? props.title : 'No active games'}</Text>
          <Text style={styles.subheader}>{props.user && props.user.gameId ? props.subtitle : ''}</Text>
      </View>
    </Drawer.Section>

  );
}

const mapState = state => ({
    user: state.user
});

export default withTheme(connect(mapState)(Header));

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      ...Layout.defaultHeader
    },
    subheader: {
      ...Layout.defaultSubheader
    }
})
