import React from 'react';
import { connect } from 'react-redux';
import { Drawer, withTheme, Text } from 'react-native-paper';

function Header(props) {
  return (
    <Drawer.Section style={{ height: '100%', width: '100%', backgroundColor: props.theme['colors']['background'] }}>
        <Text>{props.user && props.user.gameId ? props.title : 'No active games'}</Text>
        <Text>{props.user && props.user.gameId ? props.subtitle : ''}</Text>
    </Drawer.Section>
  );
}

const mapState = state => ({
    user: state.user,
    theme: state.theme
});

export default withTheme(connect(mapState)(Header));
