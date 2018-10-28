import axios from 'axios';
import { injectable } from "inversify";

@injectable()
export class HttpRunner
{
    public async Exe(cmd): Promise<void>
    {
        try
        {
            await axios.get(cmd);
        }
        catch (error)
        {
            console.log(error.message);
        }
    }
}
