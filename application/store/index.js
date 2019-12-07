import { createStore, combineReducers } from 'redux';
import messages, { gotMessages, gotNewMessage } from './messages';
import user, { gotUser } from './user';
import task, { gotTask } from './task';
import theme, { changedTheme } from './theme';
import socket from './socket';
import { showMessage } from "react-native-flash-message";

let navigate;
const reducers = combineReducers({ messages, user, task, theme });
const store = createStore(reducers);
socket.on('showMessage', res => {
    const {message, type = 'info'} = res;
    showMessage({
        message, type
    })
});
socket.on('priorMessages', ({messages}) => {
    store.dispatch(gotMessages(messages));
});

socket.on('userUploaded', response => {
    const { user } = response;
    store.dispatch(gotUser(user));
    navigate(user.teamToken ? user.gameId ? 'Question' : 'MemberChat' : 'UserProfile');
});

socket.on('incomingMessage', message => {
    store.dispatch(gotNewMessage(message));
});

socket.on('incomingTask', task => {
    store.dispatch(gotTask(task));
});
socket.on('taskUpdated', task => {
    store.dispatch(gotTask(task));
});

export const submitTask = (answer, user) => {
    socket.emit('submitTask', {
        answer, user
    })
}
export const updateTask = (user) => {
    socket.emit('updateTask', {
        user
    })
}

export const enterUser = (credentials, navigation) => {
    socket.emit('enterUser', credentials);
    navigate = navigation.navigate
};

export const openChat = (user) => {
    socket.emit('chat', {user});
};
export const sendMessage = (text, sender) => {
    socket.emit('message', { text, sender });
};
export const changeTheme = (theme) => {
    store.dispatch(changedTheme(theme));
};


export default store;
export * from './messages';
