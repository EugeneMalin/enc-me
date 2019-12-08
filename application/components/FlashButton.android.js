import * as React from 'react';
import { StyleSheet, Alert } from 'react-native';
import { FAB } from 'react-native-paper';
import Torch from 'react-native-torch';

class FlashButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          isOn: false,
          canChange: false
        }
    }

    componentDidMount() {
        Torch.requestCameraPermission(
            'Camera Permissions', // dialog title
            'We require camera permissions to use the torch on the back of your phone.' // dialog body
        ).then(rights => {
            if (!rights) {
                Alert.alert('Has no access to torch')
            }
            this.setState({
                canChange: rights
            })
        });
    }

    render() {
        return <FAB
            style={this.state.isOn ? styles.flashOn: styles.flashOff}
            icon="plus"

            onPress={() => {
                this.state.canChange && Torch.switchState(!this.state.isOn);
                this.setState({isOn: !this.state.isOn})
            }}
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