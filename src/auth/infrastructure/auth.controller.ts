import { Controller, Post, Body, UseGuards, Get, Req, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../infrastructure/dto/create-user.dto';
import { LoginUserDto } from '../infrastructure/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './get-user.decorator';
import { User } from 'src/user/infrastructure/typeorm/user.entity';
import { UserMapper } from 'src/user/infrastructure/mappers/user.mapper';

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

  @Get('private')
  @UseGuards( AuthGuard('jwt') )
  testingPrivateRoute(
    @GetUser() user: User
  ){
    return {
      ok: true,
      message: 'Authorized',
      user: UserMapper.toDTO(user)
    }
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
