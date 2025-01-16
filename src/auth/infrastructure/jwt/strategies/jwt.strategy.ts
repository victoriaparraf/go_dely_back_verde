import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../../auth.service';
import { UserRepository } from 'src/user/infrastructure/typeorm/user.repository';
import { IJwtPayload } from '../interfaces/jwt-payload.interface.strategy';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService, private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: IJwtPayload) {
    const user = await this.userRepository.findById( payload.user_id ); 
    if (!user) throw new UnauthorizedException('Error: token invalid')
    return user;
  }
}