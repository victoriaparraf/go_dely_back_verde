import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/infrastructure/dto/create-user.dto';


export class UpdateUserDto extends PartialType(CreateUserDto) {}