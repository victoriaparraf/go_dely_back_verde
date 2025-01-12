export class LoginResponseDto {
    user: {
      id: string;
      email: string;
      name: string;
      phone: string;
      type: string;
    };
    token: string;
  }