import { createStore, combineReducers } from 'redux';
import user, { gotUser } from './user';
import socket from './socket';
import { showMessage } from "react-native-flash-message";
import theme, { changedTheme } from './theme'


let navigate;
const reducers = combineReducers({ user, theme });
const store = createStore(reducers);

socket.on('showMessage', res => {
    const { message, type = 'info' } = res;
    showMessage({
        message, type
    })
});

export const changeTheme = (theme) => {
    store.dispatch(changedTheme(theme));
}



export const enterUser = (credentials) => {
    socket.emit('enterUser', credentials);
};



export default store;
