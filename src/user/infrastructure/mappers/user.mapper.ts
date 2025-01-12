import { ResponseUserDto } from 'src/user/application/dto/response-user.dto';
import { User } from '../typeorm/user-entity';

export class UserMapper {
  static toDTO(user: User): ResponseUserDto {
    return {
      id: user.user_id,
      email: user.user_email,
      name: user.user_name,
      phone:user.user_phone,
      image: user.user_image || null,
      type: user.user_role,
    };
  }
}