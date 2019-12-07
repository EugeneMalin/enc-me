import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';




const io: Server = socket(http.createServer().listen(1387));

const mobileSockets: { [key: string]: IMobileSockets } = {};

// const url: any = 'http://10.76.173.216:5055://showAllGames/';


connection.sync().then(() => {
    io.on('connection', socket => {
        socket.on('answer', ({ answer }) => {
            logger.info(`Emit 'answer' with ${answer}`)
            socket.emit('answered', `You ask me ${answer} without sudo...`);

        })
    })
})
