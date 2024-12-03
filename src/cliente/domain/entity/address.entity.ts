

export class Address {
    private readonly _latitude: number;
    private readonly _longitude: number;
    private readonly _name: string;
    private readonly _clientId: string;
  
    constructor(latitude: number, longitude: number, name: string, clientId: string) {
      this.ensureIsValidCoordinates(latitude, longitude);
      this.ensureIsValidName(name);
      this._latitude = latitude;
      this._longitude = longitude;
      this._name = name;
      this._clientId = clientId;
    }
  
    public getLatitude(): number {
      return this._latitude;
    }
  
    public getLongitude(): number {
      return this._longitude;
    }
  
    public getName(): string {
      return this._name;
    }
  
    public getClientId(): string {
      return this._clientId;
    }
  
    private ensureIsValidCoordinates(latitude: number, longitude: number): void {
      if (latitude < -90 || latitude > 90) {
        throw new Error('La latitud debe estar entre -90 y 90 grados.');
      }
      if (longitude < -180 || longitude > 180) {
        throw new Error('La longitud debe estar entre -180 y 180 grados.');
      }
    }
  
    private ensureIsValidName(name: string): void {
      const minLength = 2;
      const maxLength = 50;
  
      if (!name || name.trim().length === 0) {
        throw new Error('Name cannot be empty');
    }

    if (name.length < minLength || name.length > maxLength) {
        throw new Error(`El nombre debe tener entre ${minLength} y ${maxLength} caracteres.`);
    }
  
    }
  }
  