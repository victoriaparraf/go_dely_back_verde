import { Controller, Patch, Param, Body, Delete, Post, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { AddAddressDto } from '../application/dto/address-add.dto';
import { UpdateAddressDto } from '../application/dto/address-update.dto';


@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  updateProfile(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Post(':id/address')
  addAddress(@Param('id') id: string, @Body() addAddressDto: AddAddressDto[]) {
    return this.userService.addAddress(id, addAddressDto);
  }

  @Patch('address')
  updateAddress( @Body() delUpdateAddressDto: UpdateAddressDto[]) {
    return this.userService.updateAddress(delUpdateAddressDto);
  }

  @Delete(':id/address')
  deleteAddress(@Param('id') id: string) {
    return this.userService.deleteAddress(id);
  }

  @Get(':id/address') 
  getAddress(@Param('id') id: string) { 
    return this.userService.getAddress(id);
  }

}
