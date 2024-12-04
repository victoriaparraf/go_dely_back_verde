


export class UserEmail {
    private readonly value: string;
  
    constructor(value: string) {
      this.ensureIsValidEmail(value);
      this.value = value.toLowerCase(); // Asegura que el correo esté en minúsculas
    }
  
    public getValue(): string {
      return this.value;
    }
  
    private ensureIsValidEmail(value: string): void {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
      if (typeof value !== 'string') {
        throw new Error('The email must be a text string.');
      }
  
      if (!regex.test(value)) {
        throw new Error('The email is not valid.');
      }
  
      if (value !== value.toLowerCase()) {
        throw new Error('The email must be in lowercase.');
      }
    }
  }
  
  