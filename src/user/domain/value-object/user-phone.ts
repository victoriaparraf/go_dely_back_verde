

export class UserPhone{
    
    private readonly value: string;
    
    constructor(value: string) {
        this.ensureIsValidPhone(value);
        this.value = value;
    }
    
    public getValue(): string {
        return this.value;
    }
    
    private ensureIsValidPhone(value: string): void {
        const regex = /^\+?\d{10,15}$/;
    
        if (typeof value !== 'string') {
        throw new Error('The phone number must be a text string.');
        }
    
        if (!regex.test(value)) {
        throw new Error('The phone number is invalid. It must be between 10 and 15 digits and can start with a + sign.');
        }
    }
      
      
}