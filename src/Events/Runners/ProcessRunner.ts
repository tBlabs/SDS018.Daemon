import { spawn } from 'child_process';
import { injectable } from "inversify";
import 'reflect-metadata';

@injectable()
export class ProcessRunner
{
    public async Exe(rawCmd: string): Promise<void> 
    {
        try
        {
            const output = await this.SpawnProcess(rawCmd);
            console.log(output);
        }
        catch (error)
        {
            console.log(error.message);
        }
    };

    private async SpawnProcess(rawCmd: string): Promise<string>
    {
        return new Promise<string>((resolve, reject) => 
        {
            const process = spawn('sh', ['-c', rawCmd]);

            process.stdout.on('data', (data) =>
            {
                resolve(data.toString());
            });

            process.stderr.on('data', (data) =>
            {
                reject('STDERR: ' + data.toString());
            });

            process.on('error', (error: Error) =>
            {
                reject('ERROR: ' + error.toString());
            });

            process.on('close', (code, signal) =>
            {
                reject('CLOSE: ' + code.toString() + ' ' + signal);
            });

            process.on('disconnect', () =>
            {
                reject('DISCONNECT');
            });

            process.on('exit', (code, signal) =>
            {
                reject('EXIT: ' + code.toString());
            });

            process.on('message', (msg) =>
            {
                reject('MESSAGE: ' + msg);
            });
        });
    }
}
