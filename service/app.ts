import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import { connection, IMobileSockets, coordinateInt } from './lib/sequelize'
import './lib/relations';
import { post, get } from './lib/engine'

import { request } from 'http';
import { User } from './lib/relations';
import { isError } from 'util';

var obj = { 'accountName': 'novikov', 'password': '12345678' },
    path = '/api/account/signIn';

// 
// //зов функции  post
// post(obj, path).then((answer: string) => {
//     console.log("Answer -_> ", answer);
// })



const io: Server = socket(http.createServer().listen(1387));

const mobileSockets: { [key: string]: IMobileSockets } = {};
const arrCoord = [];
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
                            teamToken: user.teamToken,
                            coordinate: [0, 0]

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

        // собств-на задаем координаты от пользователя \ обновяем
        socket.on('getCoordFromUser', (data) => {
            mobileSockets[data.userId].coordinate = data.coord;
        });

        //каждые 5 минут уточняем у пользователя координаты его (все пользователи)
        setInterval(() => {
            socket.broadcast.emit('updateCoord', {});//все пользователи получат событие
        }, 300000);


        // Когфд апользователь заходит на карту - нужно передать ему координаты его команды
        socket.on('calcCoord', (teamToken) => {

            User.findAll({ where: { teamToken: teamToken }, raw: true })
                .then((users) => {
                    console.log(users);
                    var teamCoordinate: number[][] = [];
                    users.forEach((user) => {
                        teamCoordinate.push(mobileSockets[user.id].coordinate);
                        // // var keys = Object.keys(mobileSockets),
                        // //     index = keys.indexOf(user.id.toString()),
                        // //     savedSocketId;
                    });
                    socket.emit('signedIn', teamCoordinate);
                    // teamCoordinate

                }).catch(err => console.log('calcCoords', err));
        });
    })
})
