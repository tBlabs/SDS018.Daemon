import * as SerialPort from 'serialport';

export class Serial
{
    private serial?: SerialPort;
    private isConnected: boolean = false;
    private onConnectionCallback?: () => void;
    private onDataCallback?: (data: Buffer) => void;

    public async Disconnect(): Promise<void>
    {
        return new Promise<void>((resolve, reject) =>
        {
            if (this.serial)
            {
                this.serial.close((error: Error) =>
                {
                    resolve();
                });
            }
            else reject();
        });
    }

    public Connect(port: string, baudRate: number): void  
    {
        this.serial = new SerialPort(port, { baudRate: baudRate });

        this.serial.on('data', (data: Buffer) =>
        {
            if (this.onDataCallback)
            {
                this.onDataCallback(data);
            }
        });

        this.serial.on('open', () =>
        {
            // console.log('SERIAL OPEN @', port);

            this.isConnected = true;

            if (this.onConnectionCallback)
            {
                this.onConnectionCallback();
            }
        });

        this.serial.on('error', (err: any) =>
        {
            console.log('SERIAL ERROR', err);

            this.isConnected = false;
        });

        this.serial.on('close', () =>
        {
            // console.log('SERIAL CLOSE');

            this.isConnected = false;
        });
    }

    public OnData(onDataCallback: (data: Buffer) => void): void
    {
        this.onDataCallback = onDataCallback;
    }

    public OnConnection(onConnectionCallback: () => void): void
    {
        this.onConnectionCallback = onConnectionCallback;
    }

    public Send(data): void
    {
        if (this.isConnected)
        {
            if (this.serial !== undefined)
            {
                this.serial.write(data);
            }
        }
    }
}
