import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';
import { post, get } from './lib/engine'

import { request } from 'http';
import { User, Message, Answer } from './lib/relations';

var obj = { 'accountName': 'novikov', 'password': '12345678' },
    path = '/api/account/signIn';

// 
// //зов функции  post
post(obj, path).then((answer: string) => {
    console.log("Answer -_> ", answer);
})



const io: Server = socket(http.createServer().listen(1387));

const mobileSockets: { [key: string]: IMobileSockets } = {};

// const url: any = 'http://10.76.173.216:5055://showAllGames/';


connection.sync().then(() => {
    User.create({
        userName: "Vladimir"
    }).then((user) => {
        Message.create({
            user_id: user.id,
            message: "Hello World!"
        })
        Answer.create({
            user_id: user.id,
            userAnswer: "I have IDEA!"
        })
    });
})
