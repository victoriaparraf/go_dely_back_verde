import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/user/infrastructure/typeorm/user.entity";
import { IJwtPayload } from "../interfaces/jwt-payload.interface.strategy";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ConfigService } from "@nestjs/config";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy ){

    constructor(

        @InjectRepository ( User )
        private readonly userRepository: Repository<User>,

        configService: ConfigService

    ) {

        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        });

    }

    async validate(payload: IJwtPayload): Promise<any> {
        
        const { user_id } = payload;
    
        const user = await this.userRepository.findOne({ where: { user_id } });
    
        if (!user) {
            throw new UnauthorizedException('Token not valid');
        }
    
        if (user.user_status !== 'active') {
            throw new UnauthorizedException('Inactive user, talk to an admin');
        }
    
        return { user_id: user.user_id };
    }
}