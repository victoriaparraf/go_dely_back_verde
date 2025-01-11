import { ResponseUserDto } from 'src/user/application/dto/response-user.dto';
import { User } from '../typeorm/user-entity';

export class UserMapper {
  static toDTO(user: User): ResponseUserDto {
    return {
      id: user.user_id,
      email: typeof user.user_email === 'string' ? user.user_email : user.user_email.getValue(),
      name: typeof user.user_name === 'string' ? user.user_name : user.user_name.getValue(),
      phone: typeof user.user_phone === 'string' ? user.user_phone : user.user_phone.getValue(),
      image: user.user_image || null,
      type: user.user_type,
    };
  }
}