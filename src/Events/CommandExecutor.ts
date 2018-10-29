import { injectable } from 'inversify';
import { ProcessRunner } from './Runners/ProcessRunner';
import { HttpRunner } from './Runners/HttpRunner';

enum CommandType
{
    HttpGet,
    Bash
}

@injectable()
export class CommandExecutor
{
    constructor(
        private _httpRunner: HttpRunner,
        private _processRunner: ProcessRunner)
    { }

    private DetermineCommandType(cmd: string): CommandType
    {
        if (cmd.startsWith('GET:')) return CommandType.HttpGet;
        if (cmd.startsWith('BASH:')) return CommandType.Bash;
        return CommandType.HttpGet;
    }

    private RemoveCommandTypeMarker(cmd: string): string
    {
        return cmd.replace('GET:', '').replace('BASH:', '');
    }

    public async Execute(cmd: string): Promise<void>
    {
        const commandType = this.DetermineCommandType(cmd);

        cmd = this.RemoveCommandTypeMarker(cmd);
        switch (commandType)
        {
            case CommandType.HttpGet:
                await this._httpRunner.Exe(cmd);
                break;

            case CommandType.Bash:
                await this._processRunner.Exe(cmd);
                break;
        }
    }
}