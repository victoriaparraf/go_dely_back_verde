export class ComboName {

    protected readonly value: string;

    constructor(value: string) {
        if (!value || value.trim().length === 0) {
            throw new Error('Combo name cannot be empty');
        }
        this.value = value.trim();
    }

    public getValue(): string {
        return this.value;
    }
    
}