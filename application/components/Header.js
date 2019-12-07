import React from 'react';
import { connect } from 'react-redux';
import { Drawer, withTheme, Text, Switch } from 'react-native-paper';
import { View } from 'react-native';
import { changeTheme } from "../store";

class Header extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    isSwitchOn: false,
  };

  render() {
    const { isSwitchOn } = this.state;
    return (
      <View style={{ left: '-16px', margin: '0', padding: '0', height: '100%', width: '110%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text style={{ width: '100%' }}>{this.props.user && this.props.user.gameId ? this.props.title : 'No active games'}</Text>
        <Text style={{ width: '100%' }}>{this.props.user && this.props.user.gameId ? this.props.subtitle : ''}</Text>
        <View style={{ flexDirection: "row", left: '0' }}>
          <Switch style={{ backgroundColor: this.props.theme['colors']['btnColor'], left: '0' }}
            theme={this.props.theme}
            value={isSwitchOn}
            onValueChange={() => {
              this.setState({ isSwitchOn: !isSwitchOn });
              changeTheme(this.props.theme);
            }} />
          <Text>DarkMode</Text>
        </View>
      </View >
    );
  }
}

const mapState = state => ({
  user: state.user,
  theme: state.theme
});


export default withTheme(connect(mapState)(Header));
