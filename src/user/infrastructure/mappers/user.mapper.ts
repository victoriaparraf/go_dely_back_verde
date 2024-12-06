import { ResponseUserDto } from 'src/user/application/dto/response-user.dto';
import { User } from '../typeorm/user.entity';

export class UserMapper {
  static toDTO(user: User): ResponseUserDto {
    return new ResponseUserDto(
        user.user_id,
        user.user_email ? user.user_email.getValue() : null,
        user.user_name ? user.user_name.getValue() : null,
        user.user_phone ? user.user_phone.getValue() : null,
        user.user_type,
        user.user_status,
        user.user_image,
    );
  }
}