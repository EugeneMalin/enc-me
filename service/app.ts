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


connection.sync({ force: true }).then(() => {
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

// var obj = { accountName: 'novikov', password: '12345678' },
//     path = '/api/account/signIn';
// post(obj, path).then((answer): any => {
//     let answerObj = JSON.parse(answer);
//     console.log("Answer -_> ", answer);
//     if (answerObj.isSuccess) {


//         return User.findOrCreate({
//             where: {
//                 userName: obj.accountName
//             },
//             defaults: {
//                 id: answerObj.accountID,
//                 accountName: obj.accountName,
//                 hashedPassword: obj.password,
//                 token: answerObj.token,
//                 teamToken: answerObj.teamToken,
//                 firstName: answerObj.accountFirstName,
//                 lastName: answerObj.accountLastName,
//                 gameId: 0
//             }// если он не существует мы содаем его с этими доп данными

//         }).then((user) => {
//             console.log('USER!!!!!!!!!!! ', user);
//         });
//     } else {
//         console.log('FALSE)(((((((((((((()))))))))))))) ');
//         // return socket.emit('signedIn', {
//         //     user: null
//         // });
//     }
// })
// // var url = 'http://10.76.173.216:5055/showAllGames/';
// var url = 'http://10.76.173.216:5055/api/account/signIn/';


// export function post(data: object, path: string) {
    //     return new Promise<string>((resolve) => {
    //         const req = request({
    //             hostname: 'http://10.76.173.216',
    //             port: 5055,
    //             path: path,
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             }
    //         }, (res) => {
    //             res.setEncoding('utf8');
    //             res.on('data', (body) => {
    //                 console.log('body', body);
    //                 resolve(body);
    //             });
    //         })
    //         req.on('error', function (e) {
    //             console.log('problem with request: ' + e.message);
    //         });
    //         req.write(JSON.stringify(data))
    //         req.end()
    //     })
    // }


// var options_v2 =
// {
//     hostname: '10.76.173.216',
//     port: 5055,

//     method: 'POST',
//     body: bodyObj,
//     headers: {
//         'Content-Type': 'application/json',
//     }

// };

// var bodyObj = JSON.stringify({ 'accountName': 'novicow', 'password': '12345678' });
// var options =
// {
//     hostname: '10.76.173.216',
//     port: 5055,
//     path: "/api/account/signIn",
//     method: 'POST',
//     body: bodyObj,
//     headers: {
//         'Content-Type': 'application/json',
//     }

// };
// http.request(options, (data) => {
//     console.log('answer -- > ', data);
// });
// setInterval(() => {
//     http.request(options_v2, (data) => {
//         console.log('answer -- > ', data);
//     });

// }, 3000);
// // http.request(options, (data) => {
// //     console.log('answer --> ', data);
// // });




// var options =
// {
//     hostname: '10.76.173.216',
//     port: 5055,
//     path: "",
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json',
//     }

// };
// http.request(options, (data) => {
//     console.log('answer ----> ', data);
// });