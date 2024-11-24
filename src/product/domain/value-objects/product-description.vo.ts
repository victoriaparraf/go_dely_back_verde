export class ProductDescription {
    private readonly value: string;

    constructor(value: string) {
        this.value = value ? value.trim() : null;
    }

    getValue(): string | null {
        return this.value;
    }
}
