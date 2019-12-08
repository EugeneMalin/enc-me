import React from 'react';
import { Drawer, withTheme, TextInput, Text, Button } from 'react-native-paper';
import { connect } from 'react-redux';
import Header from '../components/Header';
import { submitTask, updateTask } from '../store';

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
    const clues = this.props.task && this.props.task.clues || []
    const delay = this.props.task && this.props.task.delay || {min: 0, sec: 0}
    return (
      <Drawer.Section style={{ height: '100%', backgroundColor: this.props.theme['colors']['background'] }}>
        <Text style={{margin: 12}}>
          {(this.props.task && this.props.task.question) || 'Questions is over'}
        </Text>

        {clues.map(exp => <Text style={{marginLeft: 12, marginRight: 12, marginTop: 3}}>
          {exp}
        </Text>)}
        
        { this.props.task && this.props.task.cluesCount && clues.length != this.props.task.cluesCount ?
          <Text>
            Other hint after: {delay.min}:{delay.sec}. {clues.length}/{this.props.task.cluesCount||0}
          </Text>
        :null
        }
        {(this.props.task && this.props.task.question) ?
        <TextInput
          onChangeText={ value => this.handleChange('answer', value)}
          placeholder='answer'
          returnKeyType='go'
          autoCapitalize='none'
        />
        : null }
        {(this.props.task && this.props.task.question) ?
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
  theme: state.theme,
  task: state.task,
  user: state.user
});

export default withTheme(connect(themeState)(Question));
