import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';
import { post, get } from './lib/engine'

import { request } from 'http';
import { User } from './lib/relations';

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
    io.on('connection', socket => {
        socket.on('answer', ({ answer }) => {
            logger.info(`Emit 'answer' with ${answer}`)
            socket.emit('answered', `You ask me ${answer} without sudo...`);
        })
        socket.on('signIn', (userName: string, password: string) => {

            var path = '/api/account/signIn', obj = { 'accountName': userName, 'password': password };
            // var obj = { 'accountName': 'novikov', 'password': '12345678' },
            //     path = '/api/account/signIn';
            post(obj, path).then((answer): any => {
                let answerObj = JSON.parse(answer);

                if (answerObj.isSuccess) {

                    User.findOrCreate({
                        where: {
                            userName: userName
                        },
                        defaults: {

                            id: answerObj.accountID,
                            accountName: userName,
                            hashedPassword: password,
                            token: answerObj.token,
                            teamToken: answerObj.teamToken,
                            firstName: answerObj.accountFirstName,
                            lastName: answerObj.accountLastName,
                            gameId: 0
                        }// если он не существует мы содаем его с этими доп данными

                    }).then((user) => {
                        socket.emit('signedIn', {
                            user: user
                        });
                    });
                } else {
                    socket.emit('signedIn', {
                        user: null
                    });
                }
            })
        })
    })
})
