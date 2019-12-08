import socket, { Server } from 'socket.io';
import http from 'http';
import config from './lib/config'
import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';
import { post, get } from './lib/engine'
import {Op} from 'sequelize'

import { User, Message } from './lib/relations';

const io: Server = socket(http.createServer().listen(config.get('socketPort')));

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
            const uploadUser = (user: User) => {
                mobileSockets[user.id] = {
                    socket: socket.id,
                    teamToken: user.teamToken,
                    coordinate: [0, 0]
                }
        
                socket.emit('userUploaded', {
                    user
                });
            }
            // вход пользователя по паролю и логину
            socket.on('enterUser', (credentials: {
                userName: string,
                password: string
            }) => {
                if (!credentials) {
                    return;
                }
                if (!credentials.userName && !credentials.password) {
                    return;
                }
                
                post({
                    accountName: credentials.userName,
                    password: credentials.password
                }, '/api/account/signIn').then((res: string) => {
                    const engineUser = JSON.parse(res);
                    const userDraft = User.getDraft(credentials.userName, credentials.password)
                    engineUser.isSuccess ? 
                        User.findOrCreate({
                            where: {
                                userName: credentials.userName
                            },
                        }).then(([user]) => {
                        if (user) {
        
                            if (engineUser.token) {
                                user.token = engineUser.token
                            }
                            if (engineUser.teamToken) {
                                user.teamToken = engineUser.teamToken
                            }
                            if (engineUser.accountFirstName) {
                                user.firstName = engineUser.accountFirstName
                            }
                            if (engineUser.accountLastName) {
                                user.lastName = engineUser.accountLastName
                            }
                            if (engineUser.games && engineUser.games[1]) {
                                user.gameId = engineUser.games[1]
                            }
                            user.hashedPassword = userDraft.hashedPassword
                            user.salt = userDraft.salt
                            
        
                            user.save().then(() => {
                                if (user.check(credentials.password)) {
                                    uploadUser(user);
                                } else {
                                    socket.emit('showMessage', {
                                        message: `Неправильный пароль для ${credentials.userName}.`,
                                        type: 'danger',
                                        kind: 'auth'
                                    });
                                }
                            })
                        } else {
                            socket.emit('showMessage', {
                                message: `Пользователь ${credentials.userName} не существует.`,
                                type: 'danger',
                                kind: 'auth'
                            });
                        }
                    }) : socket.emit('showMessage', {
                        message: `Неавторизованный в системе пользователь ${credentials.userName}.`,
                        type: 'danger',
                        kind: 'auth'
                    });
                    
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
                const teamToken = user.teamToken
                User.findAll({
                    where: {
                        [Op.or]: [
                            {teamToken},
                            {id: BOT.id}
                        ]
                    },
                    include: [Message]
                }).then(users => {
                    const messages: Message[] = [];
                    users.forEach(user => {
                        messages.push(...user.messages.filter(msg => msg.groupId === teamToken).map(msg => msg.mark(user)))
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
            const incomingTask = (res: string, socketId?: string) => {
                const data = JSON.parse(res);
                const parsed: string[] = data['text'].split('\n').map((item: string) => item ? item.trim() : '')
                const cluesCount = parseInt(((parsed.shift()||'').split("(has")[1]||'0').trim())
                const question = parsed.shift();
                const min = Math.round(parseInt(data["span"]) / 60) || 0
                const sec = Math.round(parseInt(data["span"]) % 60) || 0
                const explanation = ((parsed.shift()||'').split(':')[1]||'').trim()
                const clues = parsed.length ? parsed.filter((item: string, index: number) => index % 2) : ['No clues']
                
                if (!socketId) {
                    socket.emit('incomingTask', {
                        task: {
                            question,
                            clues,
                            cluesCount,
                            delay: {
                                min,
                                sec
                            },
                            explanation
                        }
                    })

                } else {
                    socket.to(socketId).emit('incomingTask', {
                        task: {
                            question,
                            clues,
                            cluesCount,
                            delay: {
                                min,
                                sec
                            },
                            explanation
                        }
                    })
                }
                
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
                    incomingTask(res)
                    Object.keys(mobileSockets).forEach(userId => {
                        if (mobileSockets[userId].teamToken === user.teamToken) {
                            incomingTask(res, mobileSockets[userId].socket)
                        }
                    })
                })
            })
            ///TASK
        })
    })
})
