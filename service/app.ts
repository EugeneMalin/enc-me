import socket, { Server } from 'socket.io';
import http from 'http';

import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';
import { post, get } from './lib/engine'

import { User, Message } from './lib/relations';

const io: Server = socket(http.createServer().listen(1387));

const mobileSockets: { [key: string]: IMobileSockets } = {};
connection.sync().then(() => {
    User.findOrCreate({
        where: {
            userName: 'bot',
            firstName: 'Бот',
            lastName: 'Ассистент'
        }
    }).then(([BOT]) => {
        io.on('connection', socket => {
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
                        socket.emit('showMessage', {
                            message: `Неавторизованный в системе пользователь ${obj.accountName}.`,
                            type: 'danger',
                            kind: 'auth'
                        })
                    }
                })
            });

            // собств-на задаем координаты от пользователя \ обновяем их
            socket.on('getCoordFromUser', (data) => {
                mobileSockets[data.userId].coordinate = data.coord;
            });
            //каждые 5 минут уточняем у пользователя координаты его (все пользователи)
            setInterval(() => {
                socket.broadcast.emit('updateCoord', {});//все пользователи получат событие
            }, 300000);
            // Когда пользователь заходит на карту - нужно передать ему координаты его команды
            socket.on('calcCoord', (teamToken) => {

                User.findAll({ where: { teamToken: teamToken }, raw: true })
                    .then((users) => {
                        console.log(users);
                        var teamCoordinate: number[][] = [];
                        users.forEach((user) => {

                        });
                        socket.emit('signedIn', teamCoordinate);
                        // teamCoordinate

                    }).catch(err => console.log('calcCoords', err));
            });

            ///BOT
            socket.on('initBot', () => {
                socket.broadcast.emit('showMessage', {
                    message: 'Bot is online',
                    type: 'info'
                });
                mobileSockets[BOT.id] = {
                    socket: socket.id,
                    teamToken: null,
                    coordinate: [0, 0]
                }
            })
            socket.on('answerBot', ({token, answer}) => {
                Message.createMessage(answer, BOT.id, token)
                    .then(message => message.markUser())
                    .then(message => {
                        Object.keys(mobileSockets).forEach(userId => {
                            if (mobileSockets[userId].teamToken === token) {
                                const receiverSocketId = mobileSockets[userId].socket;
                                
                                socket.to('' + receiverSocketId).emit('incomingMessage', {
                                    text: message.text, 
                                    createdAt: message.createdAt, 
                                    user: {_id: BOT.id, name: "BOT"},
                                    _id: message.id
                                });
                            }
                        })
                    })
                
            })
            ///BOT

            ///CHAT
            socket.on('chat', ({user}) => {
                User.findAll({
                    where: {
                        teamToken: user.teamToken
                    },
                    include: [Message]
                }).then(users => {
                    const messages: Message[] = [];
                    users.forEach(user => {
                        messages.push(...user.messages.filter(msg => msg.groupId === user.teamToken).map(msg => msg.mark(user)))
                    })
                    messages.sort((a, b) => {
                        return b.createdAt.getTime() - a.createdAt.getTime()
                    })
                    socket.emit('priorMessages', {messages: messages.map(message => {
                        return {
                            _id: message.id,
                            text: message.text,
                            user: message.user,
                            createdAt: message.createdAt
                        }
                    })});
                })
            });
            socket.on('message', ({ text, sender }) => {
                Message.createMessage(text, sender.id, sender.teamToken)
                    .then(message => message.markUser())
                    .then(message => {
                        socket.emit('incomingMessage', {
                            text: message.text, 
                            user: message.user, 
                            createdAt: message.createdAt,
                            _id: message.id
                        });
                        Object.keys(mobileSockets).forEach(userId => {
                            if (mobileSockets[userId].teamToken === sender.teamToken) {
                                const receiverSocketId = mobileSockets[userId].socket;
                                socket.to('' + receiverSocketId).emit('incomingMessage', {
                                    text: message.text, 
                                    user: message.user,
                                    createdAt: message.createdAt,
                                    _id: message.id
                                });
                            }
                        })
                        if (text && text.indexOf('/') === 0) {
                            const textUnits = text.split(' ')
                            socket.broadcast.emit('runBot', {command: textUnits[0], commandParams: [...textUnits.slice(1)], token: sender.teamToken, user: sender});
                        }
                    })
            });
            ///CHAT

            ///TASK 
            const incomingTask = (res: string, socketId: string) => {
                const data = JSON.parse(res);
                const parsed: string[] = data['text'].split('\n').map((item: string) => item ? item.trim() : '')
                const cluesCount = parseInt(((parsed.shift()||'').split("(has")[1]||'0').trim())
                const question = parsed.shift();
                const min = Math.round(parseInt(data["span"]) / 60) || 0
                const sec = Math.round(parseInt(data["span"]) % 60) || 0
                const explanation = ((parsed.shift()||'').split(':')[1]||'').trim()
                const clues = parsed.length ? parsed.filter((item: string, index: number) => index % 2) : ['No clues']
                
                socket.emit('incomingTask', {
                    question,
                    clues,
                    cluesCount,
                    delay: {
                        min,
                        sec
                    },
                    explanation
                })
                socket.to(socketId).emit('incomingTask', {
                    question,
                    clues,
                    cluesCount,
                    delay: {
                        min,
                        sec
                    },
                    explanation
                })
            }
            socket.on('submitTask', ({user, answer}) => {
                get({}, `/api/gameTracking/checkAnswer/${user.teamToken}@${answer}@${user.gameId}`).then(res => {
                    const data = JSON.parse(res);
                    if (!data.isSuccess) {
                        //TODO добавить статитсику ответов
                        return socket.emit('showMessage', {
                            message: `${answer} is not right.`,
                            type: 'warning',
                            kind: 'answer',
                            code: 0
                        });
                    }
                    Object.keys(mobileSockets).forEach(userId => {
                        if (mobileSockets[userId].teamToken === user.teamToken) {
                            get({}, `/api/gameTracking/nextStep/${user.teamToken}@${user.gameId}`).then((res: string) => {
                                incomingTask(res, mobileSockets[userId].socket)
                            })
                        }
                    })
                    
                })
            })
            socket.on('updateTask', ({user}) => {
                get({}, `/api/gameTracking/nextStep/${user.teamToken}@${user.gameId}`).then((res: string) => {
                    Object.keys(mobileSockets).forEach(userId => {
                        if (mobileSockets[userId].teamToken === user.teamToken) {
                            get({}, `/api/gameTracking/nextStep/${user.teamToken}@${user.gameId}`).then((res: string) => {
                                incomingTask(res, mobileSockets[userId].socket)
                            })
                        }
                    })
                })
            })
            ///TASK
        })
    })
})
