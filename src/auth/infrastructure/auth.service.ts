import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../user/infrastructure/typeorm/user-entity';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { IJwtPayload } from './jwt/interfaces/jwt-payload.interface.strategy';
import { JwtService } from '@nestjs/jwt';
import { UserEmail } from 'src/user/domain/value-object/user-email';
import { UserName } from 'src/user/domain/value-object/user-name';
import { UserPhone } from 'src/user/domain/value-object/user-phone';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private mapUserLoginToResponse(user:User):any{
    return{
      user_id: user.user_id,
      user_email: user.user_email,
      token: this.getJwtToken({ user_id: user.user_id })
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email, name, password, phone, role } = createUserDto;
      console.log('Creating user with:', { email, name, password, phone, role });

      const user = this.userRepository.create({
        user_email: new UserEmail(email),
        user_name: new UserName(name),
        user_phone: new UserPhone(phone),
        user_password: bcrypt.hashSync(password, 10),
        user_type: role || 'CLIENT',
      });

      console.log('User entity created:', user);

      await this.userRepository.save(user);

      console.log('User saved:', user);

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      this.handleDBErrors(error);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  async login( loginUserDto: LoginUserDto ) {
    
    const { user_password, user_email } = loginUserDto;
    
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_email = :email', { email: user_email })
      .addSelect(['user.user_id', 'user.user_email', 'user.user_password'])
      .getOne();
    
    
    if ( !user )
      throw new UnauthorizedException('Not valid credentials');

    if (!bcrypt.compareSync(user_password, user.user_password))
      throw new UnauthorizedException('Not valid password');

    if (user.user_status !== 'active') {
      throw new UnauthorizedException('User is inactive');
    }
    
    return this.mapUserLoginToResponse(user);

  }

  logout(token: string) {
    try {

      const decoded = this.jwtService.decode(token);
      if (!decoded) {
        throw new UnauthorizedException('Invalid token');
      }

      this.jwtService.verify(token);

      console.log(`Token for user ${decoded.user_id} is now invalid.`);

    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private getJwtToken ( payload: IJwtPayload ){

    const token = this.jwtService.sign( payload );

    return token;

  }

  private handleDBErrors (error: any){

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('Check internal server logs')
  }

  async validateUserById(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { user_id: userId } });
  }

}
