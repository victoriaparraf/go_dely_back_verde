export class ComboDescription {

    protected readonly value: string;
    
    constructor(value: string) {
        this.value = value ? value.trim() : null;
    }
    
    public getValue(): string | null {
        return this.value;
    }
}