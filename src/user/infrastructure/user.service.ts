import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException  } from '@nestjs/common';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UpdateAddressDto } from '../application/dto/address-update.dto';
import { AddAddressDto } from '../application/dto/address-add.dto';
import { User } from './Typeorm/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './Typeorm/address.entity';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from '../application/dto/response-user.dto';
import { UserMapper } from './mappers/user.mapper';


@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
  cloudinaryService: any;

  constructor(
     @InjectRepository(User) 
     private readonly userRepository: Repository<User>,
     
     @InjectRepository(Address)
     private readonly addressRepository: Repository<Address>,
     
    ) {}

  private mapAddresssToResponse( address: Address){
    return{
      address_id: address.address_id,
      name: address.name,
      latitude: address.latitude,
      longitude: address.longitude,
      user: address.user
    }
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { user_image, user_password, ...userDetails }= updateUserDto;
      const user = await this.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      if (user_image && user_image !== user.user_image) {
        if (user.user_image) {
          const publicId = user.user_image.split('/').slice(-2).join('/').split('.')[0];
            if (publicId) {
                await this.cloudinaryService.deleteImage(publicId);
            }
        }
        const uploadedImageUrl = await this.cloudinaryService.uploadImage(user_image, 'user');
        user.user_image = uploadedImageUrl;
      }

      if(user_password){
        user.user_password=  bcrypt.hashSync( user_password, 10 )
      }

      Object.assign(user, userDetails);
      await this.userRepository.save(user);

    } catch (error) {
      console.error('Error updating user profile:', error)
      this.handleDBExceptions(error);
    }
  }

  async addAddress(id: string, addAddressDto: AddAddressDto[]) {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }

      const addresses = addAddressDto.map(dto => {
        const address = new Address();
        address.name = dto.name;
        address.latitude = dto.latitude;
        address.longitude = dto.longitude;
        address.user = user;
        return address
      });

      await this.addressRepository.save(addresses);
      return addresses.map(address => this.mapAddresssToResponse(address));;
    } catch (error) {
      console.error('Error adding address:', error)
      this.handleDBExceptions(error);
    }
  }

  async updateAddress(delUpdateAddressDto: UpdateAddressDto[]){
    try {
      const addresses = await Promise.all(
        delUpdateAddressDto.map(async dto => {
          const address = await this.findAddressById(dto.id);
          if (!address) {
            throw new Error(`Address with ID ${dto.id} not found`);
          }
          Object.assign(address, dto);
          return address;
        })
      );

      await this.addressRepository.save(addresses);
      return addresses.map(address => this.mapAddresssToResponse(address));
    } catch (error) {
      console.error('Error updating address:', error);
      this.handleDBExceptions(error);
    }
  }

  async deleteAddress(id: string): Promise<string> {
    try {
      const address = await this.findAddressById(id);
      if (!address) {
        throw new Error('Address not found');
      }
      await this.addressRepository.remove(address);
      return `Address with ID ${id} deleted successfully`;
    } catch (error) {
      console.error('Error deleting address:', error);
      this.handleDBExceptions(error);
    }
  }


  async getAddress(id: string) {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user.addresses.map(address => this.mapAddresssToResponse(address));;
    } catch (error) {
      console.error('Error getting addresses:', error);
      this.handleDBExceptions(error);
    }
  }


  async findUserById(id: string): Promise<User> { 
    return await this.userRepository.findOne({ where: { user_id: id }, relations: ['addresses'] }); 
  }

  async findAddressById(id: string): Promise<Address> { 
     const address = await this.addressRepository.findOne({ where: { address_id: id } }); 
      return address; 
  }

  private handleDBExceptions (error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, check server logs');

  
}

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find();
    return users.map(UserMapper.toDTO);
  }

  async findOne(id: string): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toDTO(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    Object.assign(user, updateUserDto);
    const updatedUser = await this.userRepository.save(user);
    return UserMapper.toDTO(updatedUser);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    await this.userRepository.remove(user);
  }

}
