export class XY {
    constructor(_x: number, _y: number) {
        this.x = _x;
        this.y = _y;
    }

    toString(): string{
        return this.x.toString() + "," + this.y.toString();
    }

    x: number;
    y: number;
}