export class IoConfig
{
    private config;

    constructor()
    {
        const configFileContent = fs.readFileSync('./src/io.config.json', 'utf8');
        this.config = JSON.parse(configFileContent);
    }
    
    public Get(addr: number): string
    {
        return this.config[addr.toString()];
    }
}

export class CommandRunner
{
    public Run(updateDto: UpdateDto)
    {
        this._ioConfig.Get(updateDto.addr)
    }
}