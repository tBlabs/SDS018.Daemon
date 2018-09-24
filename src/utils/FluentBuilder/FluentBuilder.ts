import { byte } from "../FluentParser/Types/byte";

export class FluentBuilder
{
    private frame: byte[] = [];

    public Byte(b: byte): this
    {
        this.frame.push(b);

        return this;
    }

    public Word2LE(word: number): this
    {
        this.frame.push(word & 0x00FF);
        this.frame.push((word & 0xFF00)>>8);

        return this;
    }

    public Word4LE(word: number): this
    {
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