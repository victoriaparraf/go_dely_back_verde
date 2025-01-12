export class Address {
  private readonly latitude: number;
  private readonly longitude: number;
  private readonly name: string;
  private readonly clientId: string;
  private favorite: boolean;

  constructor(latitude: number, longitude: number, name: string, clientId: string, favorite: boolean = false) {
      this.ensureIsValidCoordinates(latitude, longitude);
      this.ensureIsValidName(name);
      this.latitude = latitude;
      this.longitude = longitude;
      this.name = name;
      this.clientId = clientId;
      this.favorite = favorite;
  }

  public getLatitude(): number {
      return this.latitude;
  }

  public getLongitude(): number {
      return this.longitude;
  }

  public getName(): string {
      return this.name;
  }

  public getClientId(): string {
      return this.clientId;
  }

  public isFavorite(): boolean {
      return this.favorite;
  }

  public setFavorite(favorite: boolean): void {
      this.favorite = favorite;
  }

  private ensureIsValidCoordinates(latitude: number, longitude: number): void {
      if (latitude < -90 || latitude > 90) {
          throw new Error('The latitude must be between -90 and 90 degrees.');
      }
      if (longitude < -180 || longitude > 180) {
          throw new Error('The longitude must be between -180 and 180 degrees.');
      }
  }

  private ensureIsValidName(name: string): void {
      const minLength = 2;
      const maxLength = 50;

      if (!name || name.trim().length === 0) {
          throw new Error('Name cannot be empty');
      }

      if (name.length < minLength || name.length > maxLength) {
          throw new Error(`The name must be between ${minLength} and ${maxLength} characters.`);
      }
  }
}

  