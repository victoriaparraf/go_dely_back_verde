import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../domain/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';

@Injectable()
export class AuthService {
  constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>
  ){}

  async create(createUserDto: CreateUserDto) {
    
    try {

      const { user_password, ...userData} = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        user_password: bcrypt.hashSync( user_password, 10 )
      });

      await this.userRepository.save( user )

      return user;
      
    } catch (error) {

      this.handleDBErrors(error);
      
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login( loginUserDto: LoginUserDto ) {

    const { user_password, user_email } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { user_email },
      select: {user_email: true, user_password: true}
    });

    if ( !user )
      throw new UnauthorizedException('Not valid credentials');

    if (!bcrypt.compareSync(user_password, user.user_password))
      throw new UnauthorizedException('Not valid password');
    
    return user;
  }

  private handleDBErrors (error: any){

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('Check internal server logs')
  }
}
