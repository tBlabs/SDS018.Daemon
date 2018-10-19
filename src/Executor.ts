import axios from 'axios';
import { injectable } from 'inversify';

enum CommandType
{
    HttpGet,
    Bash
}

@injectable()
export class CommandExecutor
{
    private DetermineCommandType(cmd: string): CommandType
    {
        if (cmd.startsWith('GET:')) return CommandType.HttpGet;
        else
            if (cmd.startsWith('BASH:')) return CommandType.Bash;
            else
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
                axios.get(cmd);
                break;
        }
    }
}