import React from 'react';
import { GiftedChat, Send } from 'react-native-gifted-chat';
import { connect } from 'react-redux';
import { openChat, sendMessage } from '../store';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import Header from '../components/Header';
import { Drawer, withTheme } from 'react-native-paper';

class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.send = this.send.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: () => <Header title='Game is active' subtitle='You can call help 8 (485) 230-85-49'/>
    };
  };

  componentDidMount() {
    if (!this.props.user) {
      this.props.navigation.navigate('SignIn')
      return
    }
    openChat(this.props.user);
  }

  send(message) {
    sendMessage(message.text, this.props.user);
  }
  renderSend(props) {

    return (
        <Send
            {...props}
        >
            <Ionicons
              name={Platform.OS === 'ios' ? 'ios-send' : 'md-send'}
              size={25}
              style={{
                marginRight: 90,
                marginBottom: 10
              }}
            />
        </Send>
    );
  }
  render() {
    if (!this.props.user) {
      return null
    }
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <GiftedChat
          messages={ this.props.messages }
          user={{
            _id: this.props.user.id
          }}
          onSend={ message => this.send(message[0])}
          renderSend={ props => this.renderSend(props)}
        />
      </Drawer.Section>
    );
  }
}
const themeState = (state) => ({
  theme: state.theme,
  messages: state.messages,
  user: state.user
});

export default withTheme(connect(themeState)(Chat));
