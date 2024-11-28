export class ComboStock {

    protected readonly value: number;

    constructor(value: number) {
        if (value < 0) {
            throw new Error(`Stock must be a non-negative number: ${value}`);
        }
        this.value = value;
    }

    public getValue(): number {
        return this.value;
    }
}