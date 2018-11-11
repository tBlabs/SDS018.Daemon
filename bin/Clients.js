"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Clients {
    constructor() {
        this.clients = [];
    }
    Add(socket) {
        console.log('client connected', socket.id);
        this.clients.push(socket);
        socket.on('disconnect', () => {
            console.log('client disconnected', socket.id);
            this.Remove(socket);
        });
    }
    Remove(socket) {
        const clientIndex = this.clients.indexOf(socket);
        this.clients.splice(clientIndex, 1);
    }
    SendToAll(event, ...args) {
        this.clients.forEach((socket) => {
            socket.emit(event, ...args);
        });
    }
    DisconnectAll() {
        this.clients.forEach((socket) => {
            socket.disconnect();
        });
    }
}
exports.Clients = Clients;
//# sourceMappingURL=Clients.js.map