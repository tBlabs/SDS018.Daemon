import { byte } from "../FluentParser/Types/byte";

export class FluentBuilder
{
    private frame: byte[] = [];

    public Byte(b: byte): this
    {
        if (b < 0) throw new Error('Invalid byte type value');
        if (b > 0xFF) throw new Error('Out of byte type range');
        
        this.frame.push(b);
        
        return this;
    }
    
    public Word2LE(word: number): this
    {
        if (word > 0xFFFF) throw new Error('Out of double byte type range');
        
        this.frame.push(word & 0x00FF);
        this.frame.push((word & 0xFF00)>>8);
        
        return this;
    }
    
    public Word4LE(word: number): this
    {
        if (word > 0xFFFFFFFF) throw new Error('Out of 4-byte type range');

        this.frame.push((word & 0x000000FF));
        this.frame.push((word & 0x0000FF00) >> 8);
        this.frame.push((word & 0x00FF0000) >> 16);
        this.frame.push((word & 0xFF000000) >> 24);

        return this;
    }

    private XorCalc(frame: byte[]): byte
    {
        return frame.reduce((xor, next) =>
        {
            return xor ^ next;
        });
    }

    public Xor()
    {
        this.frame.push(this.XorCalc(this.frame));

        return this;
    }

    public Build(): byte[]
    {
        return this.frame;
    }
}