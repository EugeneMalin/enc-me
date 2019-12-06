import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import {connection, IMobileSockets} from './lib/sequelize'
import './lib/relations';

const io: Server = socket(http.createServer().listen(1337));

const mobileSockets: {[key: string]: IMobileSockets} = {};

connection.sync().then(() => {
    io.on('connection', socket => {
        socket.on('answer', ({answer}) => {
            logger.info(`Emit 'answer' with ${answer}`)
            socket.emit('answered', `You ask me ${answer} without sudo...`) 
        })
    })    
})
