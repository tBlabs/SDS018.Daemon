"use strict";
// import * as express from 'express';
// import * as http from 'http';
// import * as socketIo from 'socket.io';
// export class Server
// {
//     constructor()
//     {
//         // this._server = express();
//         const httpServer = http.createServer();
//         const socket = socketIo(httpServer);
//         httpServer.listen(3000);
//     }
//     // private ioSetCallback;
//     // public OnIoSet(callback: (addr, val, res: ServerResponse) => void): void
//     // {
//     //     this.ioSetCallback = callback;
//     // }
//     // public Start(port, callback?)
//     // {
//     //     this._server.get('/favicon.ico', (req, res) => res.status(204));
//     //     this._server.all('/ping', (req, res) =>
//     //     {
//     //         res.send('pong');
//     //     });
//     //     this._server.all('/get/:addr', (req, res) =>
//     //     {
//     //         const addr: number = parseInt(req.params.addr, 10);
//     //         const response = new ServerResponse(res);
//     //         ioGetCallback(addr, response);
//     //     });
//     //     this._server.all('/set/:addr/:value', (req, res) =>
//     //     {
//     //         const addr = parseInt(req.params.addr, 10);
//     //         const value = parseInt(req.params.value, 10);
//     //         this._driver.Set(addr, value);
//     //         res.sendStatus(202);
//     //     });
//     //     this._server.use((err, req, res, next) =>
//     //     {
//     //         console.log('Globally caught server error:', err.message);
//     //         res.send(err.message);
//     //     });
//     //     if (callback === undefined)
//     //     {
//     //         callback = () => console.log('SERVER STARTED @', port);
//     //     }
//     //     httpServer.listen(port, callback);
//     // }
// } 
//# sourceMappingURL=Server.js.map