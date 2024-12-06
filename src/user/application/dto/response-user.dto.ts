export class ResponseUserDto {
    user_id: string;
    user_email: string;
    user_name: string;
    user_phone: string;
    user_type: string;
    user_status: string;
    user_image: string | null;
  
    constructor(
      user_id: string,
      user_email: string,
      user_name: string,
      user_phone: string,
      user_type: string,
      user_status: string,
      user_image: string | null,
    ) {
      this.user_id = user_id;
      this.user_email = user_email;
      this.user_name = user_name;
      this.user_phone = user_phone;
      this.user_type = user_type;
      this.user_status = user_status;
      this.user_image = user_image;
    }
  }