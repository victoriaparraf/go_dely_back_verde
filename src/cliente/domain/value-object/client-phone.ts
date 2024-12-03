

export class ClientPhone{
    
    private readonly phone: string;
    
    constructor(phone: string) {
        this.ensureIsValidPhone(phone);
        this.phone = phone;
    }
    
    public getValue(): string {
        return this.phone;
    }
    
    private ensureIsValidPhone(phone: string): void {
        const regex = /^\+?\d{10,15}$/;
    
        if (typeof phone !== 'string') {
        throw new Error('El número de teléfono debe ser una cadena de texto.');
        }
    
        if (!regex.test(phone)) {
        throw new Error('El número de teléfono no es válido. Debe contener entre 10 y 15 dígitos y puede comenzar con un signo +.');
        }
    }
      
      
}