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

//if the user, dispetch
socket.on('SignIn', res => {    
    console.log(res)
    switch (res.type) {
        case user:
            store.dispatch(gotUser(user))
            navigate
        default:
            showMessage({
                message: "Error",
                description: "Some Error",
                type: "danger"
            })
    }
})

export const enterUser = (credentials) => {
    socket.emit('enterUser', credentials);
};


export default store;
