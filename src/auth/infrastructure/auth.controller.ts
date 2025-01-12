import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../infrastructure/dto/create-user.dto';
import { LoginUserDto } from '../infrastructure/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/infrastructure/typeorm/user-entity';
import { UserMapper } from 'src/user/infrastructure/mappers/user.mapper';
import { GetUser } from './jwt/strategies/get-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('current')
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@GetUser() user: User) {
    console.log('Current user:', user);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const userDto = UserMapper.toDTO(user);
    return userDto;
  }

  @Post('logout')
  logout(@Req() req: Request) {

    const bearerToken = req.headers['authorization'] as string;

    if (!bearerToken || !bearerToken.startsWith('Bearer ')) {
      throw new UnauthorizedException('Invalid Authorization header format');
    }

    const token = bearerToken.split(' ')[1];

    if (!token) {
      return { ok: false, message: 'Token not found in Authorization header' };
    }

    this.authService.logout(token);

    return { ok: true, message: 'Logged out successfully' };
  }

}
