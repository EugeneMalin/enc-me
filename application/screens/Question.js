import React from 'react';
import { Text } from 'react-native';
import { Drawer, withTheme } from 'react-native-paper';
import { connect } from 'react-redux';

class Question extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text>Вопрос</Text>
      </Drawer.Section>
    );
  }
}

const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Question));
