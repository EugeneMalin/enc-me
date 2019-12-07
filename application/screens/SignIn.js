import React from 'react';
import { Text } from 'react-native';
import { withTheme, Drawer } from 'react-native-paper';
import { connect } from 'react-redux';


class SignIn extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text>Авторизация</Text>
      </Drawer.Section>
    )
  }
}

const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(SignIn));
