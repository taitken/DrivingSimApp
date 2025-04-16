export class Dimensions {
    constructor(_width: number, _height: number) {
        this.width = _width;
        this.height = _height;
    }

    toString(): string {
        return this.width.toString() + "," + this.height.toString();
    }

    width: number;
    height: number;
}