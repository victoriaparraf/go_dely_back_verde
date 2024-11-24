export class ProductName {
    private readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Product name cannot be empty');
        }
        this.value = value.trim();
    }

    getValue(): string {
        return this.value;
    }
}
