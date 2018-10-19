import * as SerialPort from 'serialport';

export class Serial
{
    private serial?: SerialPort;
    private isConnected: boolean = false;
    private onConnectionCallback;
    private onDataCallback;

    public Connect(port: string, baudRate: number)    
    {
        this.serial = new SerialPort(port, { baudRate: baudRate });
 
        this.serial.on('data', (data: Buffer) =>
        {
            this.onDataCallback(data);
        });

        this.serial.on('open', () =>
        {
            console.log('SERIAL OPEN @', port);
            this.isConnected = true;
            this.onConnectionCallback();
        });

        this.serial.on('error', (err) =>
        {
            console.log("SERIAL ERROR", err);
            this.isConnected = false;
        });

        this.serial.on('close', () =>
        {
            console.log('SERIAL CLOSE');
            this.isConnected = false;
        });
    }

    public OnData(onDataCallback)
    {
        this.onDataCallback = onDataCallback;
    }

    public OnConnection(onConnectionCallback)
    {
        this.onConnectionCallback = onConnectionCallback;
    }

    public Send(data)
    {
        if (this.isConnected)
        {
            if (this.serial !== undefined)
                this.serial.write(data);        
        }
    }
}
