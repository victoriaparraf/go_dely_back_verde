import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException  } from '@nestjs/common';
import { UpdateUserDto } from '../application/dto/update-user.dto';
import { UpdateAddressDto } from '../application/dto/address-update.dto';
import { AddAddressDto } from '../application/dto/address-add.dto';
import { User } from './typeorm/user-entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './typeorm/address-entity';
import * as bcrypt from 'bcrypt';
import { ResponseUserDto } from '../application/dto/response-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { AddressMapper } from './mappers/address.mapper';
import { CloudinaryService } from 'src/product/infrastructure/cloudinary/cloudinary.service';


@Injectable()
export class UserService {
  private readonly logger = new Logger('UserService');
 

  constructor(
     @InjectRepository(User) 
     private readonly userRepository: Repository<User>,
     
     @InjectRepository(Address)
     private readonly addressRepository: Repository<Address>,
    
     private readonly cloudinaryService: CloudinaryService,
    ) {}

  async updateProfile(id: string, updateUserDto: UpdateUserDto) {
    try {
      const { user_image, user_password, ...userDetails }= updateUserDto;
      const user = await this.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
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
      const updatedUser = await this.userRepository.save(user);
      return UserMapper.toDTO(updatedUser);
    } catch (error) {
      console.error('Error updating user profile:', error)
      this.handleDBExceptions(error);
    }
  }

  async addAddress(id: string, addAddressDto: AddAddressDto) {
    try {
      const user = await this.findUserById(id);
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      
        const address = new Address();
        address.name = addAddressDto.name;
        address.latitude = addAddressDto.latitude;
        address.longitude = addAddressDto.longitude;
        address.favorite = addAddressDto.favorite;
        address.user = user;
      

      await this.addressRepository.save(address);
      return  AddressMapper.toDtoAddres(address);;
    } catch (error) {
      console.error('Error adding address:', error)
      this.handleDBExceptions(error);
    }
  }

  async updateAddress(UpdateAddressDto: UpdateAddressDto){
    try {
  
      const address = await this.findAddressById(UpdateAddressDto.id);
      if (!address) {
        throw new NotFoundException(`Address with ID ${UpdateAddressDto.id} not found`);
      }
      Object.assign(address, UpdateAddressDto);
        

      await this.addressRepository.save(address);
      return AddressMapper.toDtoAddres(address);
    } catch (error) {
      console.error('Error updating address:', error);
      this.handleDBExceptions(error);
    }
  }

  async deleteAddress(id: string): Promise<string> {
    try {
      const address = await this.findAddressById(id);
      if (!address) {
        throw new NotFoundException('Address not found');
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
        throw new NotFoundException('User not found');
      }
      return user.addresses.map(address => AddressMapper.toDtoAddres(address));;
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
    const user = await this.userRepository.findOne({ where: { user_id: id } , relations: ['addresses'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toDTO(user);
  }


  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { user_id: id }, relations: ['addresses'] });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  
    // Eliminar las direcciones asociadas
    if (user.addresses && user.addresses.length > 0) {
      await this.addressRepository.remove(user.addresses);
    }
  
    // Eliminar el usuario
    await this.userRepository.remove(user);
  }
  

}
