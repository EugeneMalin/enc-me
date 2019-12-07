import React, { useContext } from "react";
import { Button, Drawer } from "react-native-paper";
import { changeTheme } from "../store";
import { withTheme } from 'react-native-paper';
import { connect } from 'react-redux';



class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Button title="Color theme" style={{ backgroundColor: this.props.theme['colors']['btnColor'] }} theme={this.props.theme} onPress={() => changeTheme(this.props.theme)}>
          Цветовая схема
        </Button>
      </Drawer.Section>
    )
  };

}


const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Profile));
