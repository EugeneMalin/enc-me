import { createStore, combineReducers } from 'redux';
import user, { gotUser } from './user';
import socket from './socket';
import { showMessage } from "react-native-flash-message";

let navigate;
const reducers = combineReducers({ user});
const store = createStore(reducers);

socket.on('showMessage', res => {
    const {message, type = 'info'} = res;
    showMessage({
        message, type
    })
});

export const logout = () => {
    onSignOut().then(() => {
        navigate('SignIn')
    })
}

export const enterUser = (credentials) => {
    socket.emit('enterUser', credentials);
};


export default store;
