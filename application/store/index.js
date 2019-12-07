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


socket.on('priorMessages', ({messages}) => {
    store.dispatch(gotMessages(messages));
});
socket.on('userUploaded', response => {
    const { user } = response;
    store.dispatch(gotUser(user));
    onSignIn(user).then(() => {
        navigate(user.teamToken ? user.gameId ? 'Question' : 'MemberChat' : 'UserProfile');
    })
});

socket.on('incomingMessage', message => {

});

socket.on('incomingHint', hint => {

});
socket.on('syncHints', ({hints}) => {

})

socket.on('incomingTask', task => {

});
socket.on('taskUpdated', task => {

});

export const updateHint = (user) => {

}
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
export const openChat = (user) => {
    socket.emit('chat', {user});
};
export const sendMessage = (text, sender) => {
    socket.emit('message', { text, sender });
};
export const enterUser = (credentials) => {
    socket.emit('SignIn', credentials);
};

// событие, запрашивающее мои координаты
socket.on('updateCoord', () => {
  if (store.getState()['user'] != undefined)
    socket.emit('getCoordFromUser', {coord: [57.631285, 39.840864], userId: store.getState()['user'].id});
});

export default store;
