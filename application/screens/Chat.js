import React from 'react';
import { Text } from 'react-native';
import { Drawer, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';

class Chat extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text>Text</Text>
      </Drawer.Section>
    );
  }
}
const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Chat));
