import * as React from 'react';
import { StyleSheet } from 'react-native';
import { FAB } from 'react-native-paper';

class FlashButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isOn: false
        }
    }
    render() {
        return <FAB
            style={this.state.isOn ? styles.flashOn: styles.flashOff}
            icon="plus"

            onPress={() => this.setState({isOn: !this.state.isOn})}
        />
    }
};

const styles = StyleSheet.create({
    flashOn: {
        width: 60,  
        height: 60,   
        borderRadius: 30,            
        backgroundColor: '#ffff00',                                    
        position: 'absolute',                                          
        bottom: 60,                                                    
        right: 20,
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    flashOff: {
        width: 60,  
        height: 60,   
        borderRadius: 30,            
        backgroundColor: '#999',                                    
        position: 'absolute',                                          
        bottom: 60,                                                    
        right: 20,
        display:'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default FlashButton;