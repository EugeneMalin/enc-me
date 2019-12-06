import socket, { Server } from 'socket.io';
import http from 'http';

import logger from './lib/log';

import { connection, IMobileSockets } from './lib/sequelize'
import './lib/relations';


import { request } from 'http';


export function post(data: object, path: string) {
    return new Promise<string>((resolve) => {
        const req = request({
            hostname: 'http://10.76.173.216',
            port: 5055,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }, (res) => {
            res.setEncoding('utf8');
            res.on('data', (body) => {
                console.log('body', body);
                resolve(body);
            });
        })
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        req.write(JSON.stringify(data))
        req.end()
    })
}
//зов функции  post
setInterval(() => { post({ 'accountName': 'novikov', 'password': '12345678' }, '/api/account/signIn') }, 1000);


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
// var url = 'http://10.76.173.216:5055/showAllGames/';






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