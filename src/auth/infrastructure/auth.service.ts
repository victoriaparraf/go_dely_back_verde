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
import { CreateUserResponseDto } from 'src/user/application/dto/create-user-response.dto';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  private getJwtToken(payload: IJwtPayload) {
    console.log('Generating JWT token for user_id:', payload.user_id);
    const token = this.jwtService.sign(payload);
    return token;
 }

  private mapUserLoginToResponse(user:User):any{
    return{
      user: {
        id: user.user_id,
        email: user.user_email,
        name: user.user_name,
        phone: user.user_phone,
        type: user.user_role
      },
      token: this.getJwtToken({ user_id: user.user_id })
    };
  }

  async validateUserById(userId: string): Promise<User> {
    return this.userRepository.findOne({ where: { user_id: userId } });
  }

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    try {
      const { email, name, password, phone, role } = createUserDto;
      console.log('Creating user with:', { email, name, password, phone, role });

      const user = this.userRepository.create({
        user_email: new UserEmail(createUserDto.email).getValue(),
        user_name: new UserName(createUserDto.name).getValue(),
        user_password: await bcrypt.hash(createUserDto.password, 10),
        user_phone: new UserPhone(createUserDto.phone).getValue(),
        user_role: createUserDto.role,
      });

      console.log('User entity created:', user);

      await this.userRepository.save(user);

      console.log('User saved:', user);

      return {
        message: 'User created',
        id: user.user_id,
      };
      
    } catch (error) {
      console.error('Error creating user:', error);
      this.handleDBErrors(error);
    }
  }

  async login( loginUserDto: LoginUserDto ) {
    
    const { email, password } = loginUserDto;
    
    const user = await this.userRepository
      .createQueryBuilder('user')
      .where('user.user_email = :email', { email: email })
      .addSelect(['user.user_id', 'user.user_email', 'user.user_password'])
      .getOne();
    
    
    if ( !user )
      throw new UnauthorizedException('Not valid credentials');

    if (!bcrypt.compareSync(password, user.user_password))
      throw new UnauthorizedException('Not valid password');

    if (user.user_status !== 'active') {
      throw new UnauthorizedException('User is inactive');
    }
    
    console.log('User before generating token:', user);
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

  private handleDBErrors (error: any){

    if (error.code === '23505')
      throw new BadRequestException(error.detail);

    console.log(error)

    throw new InternalServerErrorException('Check internal server logs')
  }

}
