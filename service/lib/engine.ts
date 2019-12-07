import { ParsedUrlQuery } from 'querystring';
import { request } from 'http';

export function post(data: object, path: string) {
    return new Promise<string>((resolve) => {
        // console.log('!resolve ---->   ', resolve);
        const req = request({
            hostname: '10.76.173.216',
            port: 5055,
            path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        }, (res) => {
            // console.log('!res---->   ', res);
            res.setEncoding('utf8');
            res.on('data', (body) => {
                resolve(body);
            });
        })
        req.on('error', function (e) {
            console.log('problem with request: ' + e.message);
        });
        // console.log('!req---->   ', req);
        req.write(JSON.stringify(data))
        req.end()
    })
}

export function get(data: object, path: string) {
    return new Promise<string>((resolve) => {
        const req = request({
            hostname: '10.76.173.216',
            port: 5055,
            path,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }, (res) => {
            res.setEncoding('utf8');
            res.on('data', (body) => {
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
