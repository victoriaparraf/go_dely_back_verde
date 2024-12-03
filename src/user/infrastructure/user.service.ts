import { Injectable } from '@nestjs/common';

import { UpdateUserDto } from '../application/dto/update-user.dto';


@Injectable()
export class UserService {

  findAll() {
    return `This action returns all client`;
  }

  findOne(id: number) {
    return `This action returns a #${id} client`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} client`;
  }

  remove(id: number) {
    return `This action removes a #${id} client`;
  }
}
