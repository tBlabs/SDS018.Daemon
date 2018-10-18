export class Config
{
    private entries: { [key: string]: string } = {};

    public AddOrUpdate(name: string, value: string): void
    {
        this.entries[name] = value;
    }

    public FindPlaceholders(str: string): string[] // public only for test
    {
        const regex = /\{(.+?)\}/gm;

        let matches: string[] = [];
        let m;
        while ((m = regex.exec(str)) !== null)
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex)
            {
                regex.lastIndex++;
            }

            matches.push(m[1]);
        }

        return matches;
    }

    public ApplyOnString(str: string): string
    {
        const placeholders = this.FindPlaceholders(str);

        placeholders.forEach(p =>
        {
            if (this.entries[p] !== undefined)
            {
                str = str.replace('{' + p + '}', this.entries[p]);
            }
        });

        return str;
    }
}