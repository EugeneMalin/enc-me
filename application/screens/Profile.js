import React, { useContext } from "react";
import { Button } from "react-native-paper";
import { changeTheme } from "../store";
import { withTheme } from 'react-native-paper';
import { connect } from 'react-redux';



class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Button title="Color theme" style={{ backgroundColor: this.props.theme['colors']['background'] }} theme={this.props.theme} onPress={() => changeTheme(this.props.theme)}>
        Цветовая схема
      </Button>
    )
  };

}


const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Profile));
