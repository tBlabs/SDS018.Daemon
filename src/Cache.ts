export class Cache
{
    private cache = {};
    private hash;

    public Update(addr, value)
    {
        this.cache[addr] = value;
        // this.hash ^= this.cache[addr]
    }

    private previousHash;
    public HasChanged(): boolean
    {
        this.hash = 0;
        Object.keys(this.cache).forEach(e => this.hash ^= this.cache[e]);
        // console.log(this.hash);

        if (this.previousHash != this.hash)
        {
            this.previousHash = this.hash;
            return true;
        }

        return false;
    }
    public Get(addr)
    {
        return this.cache[addr];
    }

    public toString()
    {
        return Object.keys(this.cache).map(e => this.cache[e]);
    }
}