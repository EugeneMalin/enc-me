import React from 'react';
import { Drawer, withTheme, TextInput, Text, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Question extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answer: ''
    };
    
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    updateTask(this.props.user)
  }

  handleChange(type, value) {
    this.setState({ [type]: value });
  }

  handleSubmit() {
    if (!this.state.answer) {
      return
    }
    submitTask(this.state.answer, this.props.user);
  }

  render() {
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text>
          {(this.props.task && this.props.task.question) || 'Questions is over'}
        </Text>

        {this.props.task.question && clues.map(exp => <Text>
          {exp}
        </Text>)}
        
        { this.props.task.cluesCount && clues.length != this.props.task.cluesCount ?
          <Text>
            Other hint after: {delay.min}:{delay.sec}. {clues.length}/{this.props.task.cluesCount||0}
          </Text>
        :null
        }
        {this.props.task.question ?
        <TextInput
          onChangeText={ value => this.handleChange('answer', value)}
          placeholder='answer'
          returnKeyType='go'
          autoCapitalize='none'
        />
        : null }
        {this.props.task.question ?
            <Button
              onPress={ this.handleSubmit }
              title='Отправить'
            />
        : null }
      </Drawer.Section>
    );
  }
}

const themeState = (state) => ({
  theme: state.theme
});

export default withTheme(connect(themeState)(Question));
