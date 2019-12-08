import React from 'react';
import { withTheme, Drawer, Text, TextInput, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import { enterUser } from '../store';
import Header from '../components/Header';

class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '' || props.userName,
      password: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Header title='' subtitle=' '/>
    };
  };

  handleChange(type, value) {
    this.setState({ [type]: value });
  }

  handleSubmit() {
    enterUser(this.state, this.props.navigation);
  }

  render() {
    return (
      <Drawer.Section style={{ height: '100%', width: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
          <Text style={{height: 40, fontSize: 24, marginLeft: 12, marginRight: 12, marginTop: 12}}>
            SignIn
          </Text>
          <Text style={{height: 30, fontSize: 16, marginLeft: 12, marginRight: 12}}>
            Please, enter your userName and password
          </Text>
          <TextInput
            style={{margin: 12}}
            onChangeText={ value => this.handleChange('userName', value) }
            returnKeyType='next'
            placeholder='userName'
            autoCorrect={ false }
            autoCapitalize='none'
            
          />
          <TextInput            
            style={{margin: 12}}
            onChangeText={ value => this.handleChange('password', value)}
            secureTextEntry
            placeholder='password'
            returnKeyType='go'
            autoCapitalize='none'
            
          />
          <Button title="Color theme" style={{ margin: 18, backgroundColor: this.props.theme['colors']['btnColor'] }} theme={this.props.theme} onPress={ this.handleSubmit }>
            Sign In
          </Button>
      </Drawer.Section>
    );
  }
}

const mapState = state => ({
  user: state.user,
  group: state.group,
  member: state.member,
  theme: state.theme
});

export default withTheme(connect(mapState)(SignIn));
