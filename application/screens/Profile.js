import React from "react";
import { Button, Drawer, Text} from "react-native-paper";
import { View } from 'react-native'
import { withTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Header title='Game is active' subtitle='You can call help 8 (485) 230-85-49' />
    };
  };

  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <View style={{flexDirection: 'row', margin: 12, alignItems: 'baseline'}}>
          <Text style={{fontSize: 12}}>
            {this.props.user.teamToken ? 'gamer: ' : 'user: '}
          </Text>
          <Text style={{fontSize: 18}}>
            {this.props.user.lastName || this.props.user.firstName ? `${this.props.user.lastName} ${this.props.user.firstName}` : 'no name'}
          </Text>
        </View>
        <View style={{flexDirection: 'row', margin: 12, alignItems: 'baseline'}}>
          <Text style={{fontSize: 12}}>
            {'userName: '}
          </Text>
          <Text style={{fontSize: 18}}>
            {this.props.user.userName}
          </Text>
        </View>
        <Button style={{ margin: 18, backgroundColor: this.props.theme['colors']['btnColor'] }} theme={this.props.theme} onPress={() => this.props.navigation.navigate('SignIn')}>
          Выйти
        </Button>
      </Drawer.Section>
    )
  };
}


const themeState = (state) => ({
  theme: state.theme,
  user: state.user
});

export default withTheme(connect(themeState)(Profile));
