

export class UserName {

    protected readonly value: string;

    constructor(value: string) {
        this.ensureIsValidName(value);
        this.value = value.trim();
    }

    public getValue(): string {
        return this.value;
    }
    
    private ensureIsValidName(value: string): void {
        const minLength = 2;
        const maxLength = 50;
        const regex = /^[a-zA-Z\s]+$/;
    
        if (!value || value.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }

        if (value.length < minLength || value.length > maxLength) {
            throw new Error(`The name must be between ${minLength} and ${maxLength} characters.`);
        }
        
        if (!regex.test(value)) {
        throw new Error('The name can only contain letters and spaces.');
        }
    }
   
}