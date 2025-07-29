export class RGBColor {
    public r: number;
    public g: number;
    public b: number;

    /**
     * @param {number} r Red component.
     * @param {number} g Green component.
     * @param {number} b Blue component.
     */
    constructor(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Sets the value of all components.
     * @param {number} r Red component.
     * @param {number} g Green component.
     * @param {number} b Blue component.
     */
    Set(r: number, g: number, b: number) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    /**
     * Creates a clone of the object.
     * @returns {RGBColor}
     */
    Clone() {
        return new RGBColor(this.r, this.g, this.b);
    }
}
export { }