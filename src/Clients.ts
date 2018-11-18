import { Socket } from "socket.io";

export class Clients
{
    private clients: Socket[] = [];

    public Add(socket: Socket): void
    {
        console.log('client connected', socket.id);

        this.clients.push(socket);

        socket.on('disconnect', () =>
        {
            console.log('client disconnected', socket.id);
            this.Remove(socket);
        });
    }

    public Remove(socket: Socket): void
    {
        const clientIndex = this.clients.indexOf(socket);

        this.clients.splice(clientIndex, 1);
    }

    public SendToAll(event: string, ...args: any[]): void
    {
        this.clients.forEach((socket: Socket) =>
        {
            socket.emit(event, ...args);
        });
    }

    public DisconnectAll(): void
    {
        this.clients.forEach((socket: Socket) =>
        {
            socket.disconnect();
        });
    }
}