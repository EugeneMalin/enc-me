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
// post(obj, path).then((answer: string) => {
//     console.log("Answer -_> ", answer);
// })



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

            console.log("<<<<<<<<<<<<<<<<< signIn >>>>>>>>>>>>>>>>>\n", userName);

            var path = '/api/account/signIn', obj = { 'accountName': userName, 'password': password };

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
                            lastName: answerObj.accountLastName
                        }// если он не существует мы содаем его с этими доп данными

                    }).then(([user]) => {
                        mobileSockets[user.id] = {
                            socket: socket.id,
                            teamToken: user.teamToken
                        }
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
        });
        // получение данных о местоположении команды
        socket.on('calcCoords', (userId) => {

            User.findAll({ where: { teamToken: mobileSockets[userId].teamToken }, raw: true })
                .then((users) => {
                    console.log(users);
                    users.forEach((user) => {
                        var keys = Object.keys(mobileSockets),
                            index = keys.indexOf(user.id.toString()),
                            teamToken;
                        if (index >= 0) {
                            //если нашли id и все хорошо
                            teamToken = mobileSockets[keys[index]].teamToken;
                            // User.findAll({ where: { teamToken: teamToken } }).then((team) => {

                            // };

                        }
                    });

                }).catch(err => console.log('calcCoords', err));
        });


    })
})
