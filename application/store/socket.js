import io from 'socket.io-client';
import { SOCKET_NAME, SOCKET_PORT } from '../constants/Networking';
const socket = io(SOCKET_NAME + ':' + SOCKET_PORT);
socket.connect();
export default socket;
