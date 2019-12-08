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
      <View style={{ display: 'flex', justifyContent: 'center', left: '-16px', margin: '0', padding: '0', height: '100%', width: '110%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text style={{ width: '100%', paddingLeft: 6, paddingRight: 6, }}>{this.props.user && this.props.user.gameId ? this.props.title : !this.props.title? this.props.title :'No active games'}</Text>
        {this.props.user && this.props.user.gameId ? <Text style={{ width: '100%', paddingLeft: 6, paddingRight: 6 }}>{ this.props.subtitle}</Text> : null}
        <View style={{ flexDirection: "row", alignItems: 'center', justifyContent: 'flex-end', paddingLeft: 6, paddingRight: 6,  }}>
          <Text style={{marginRight: 12}}>{ isSwitchOn ? 'Lignt' : 'Dark' }Mode</Text>
          <Switch style={{ backgroundColor: this.props.theme['colors']['btnColor'], left: '0' }}
            theme={this.props.theme}
            value={isSwitchOn}
            color='#45f'
            style={{marginRight: 20}}
            onValueChange={() => {
              this.setState({ isSwitchOn: !isSwitchOn });
              changeTheme(this.props.theme);
            }} />
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
