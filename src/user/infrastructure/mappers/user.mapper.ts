import { ResponseUserDto } from 'src/user/application/dto/response-user.dto';
import { User } from 'src/user/infrastructure/typeorm/user.entity';

export class UserMapper {
  static toDTO(user: User): ResponseUserDto {
    return new ResponseUserDto(
        user.user_id,
        user.user_email.getValue(),
        user.user_name.getValue(),
        user.user_phone.getValue(),
        user.user_type,
        user.user_status,
        user.user_image,
    );
  }
}