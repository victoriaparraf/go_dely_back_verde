

export class ClientName {

    protected readonly name: string;

    constructor(name: string) {
        this.ensureIsValidName(name);
        this.name = name.trim();
    }

    public getValue(): string {
        return this.name;
    }
    
    private ensureIsValidName(name: string): void {
        const minLength = 2;
        const maxLength = 50;
        const regex = /^[a-zA-Z\s]+$/;
    
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }

        if (name.length < minLength || name.length > maxLength) {
            throw new Error(`El nombre debe tener entre ${minLength} y ${maxLength} caracteres.`);
        }
        
        if (!regex.test(name)) {
        throw new Error('El nombre solo puede contener letras y espacios.');
        }
    }
   
}