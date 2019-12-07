import React from 'react';
import { View } from 'react-native'
import { Text, TextInput, Button } from 'react-native-paper';
import { showMessage } from "react-native-flash-message";

class SignIn extends React.Component {
  constructor() {
    super()
    this.state = {
      username: '',
      password: ''
    }
    this.handleChange = this.handleChange.bind(this);
    this.onPressedLogin = this.onPressedLogin.bind(this);
  }
  handleChange(type, value) {
    this.setState({ [type]: value });
  }

  onPressedLogin() {
    if (this.state.password == '' || this.state.username == '') {
      console.log(this.state)
      showMessage({
        message: "Error",
        description: "Password or login or is empty",
        type: "danger"
      })
    }
    else {
      console.log("SignIn")
    }
  }

  render() {
    return (
      <View >
        <Text> Enter your name and password:</Text>
        <TextInput
          onChangeText={value => this.handleChange('username', value)}
          returnKeyType='next'
          autoCorrect={false}
        />
        <TextInput
          onChangeText={value => this.handleChange('password', value)}
          secureTextEntry
          returnKeyType='go'
          autoCapitalize='none'
          error='false'
        />
        <Button
          onPress={this.onPressedLogin}
        >
          <Text>Login</Text>
        </Button>
      </View>
    )
  }
}

export {
  SignIn
};
