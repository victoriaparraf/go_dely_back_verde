import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './infrastructure/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy';
import { User } from 'src/user/infrastructure/typeorm/user.entity';

@Module({
  controllers: [ AuthController ],
  providers: [ AuthService, JwtStrategy ],
  imports: [

    ConfigModule,
    
    TypeOrmModule.forFeature([ User ]),

    PassportModule.register( { defaultStrategy: 'jwt' } ),

    JwtModule.registerAsync({

      imports: [ ConfigModule ],
      inject: [ ConfigService ],
      useFactory: ( configService: ConfigService ) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '30d'
        }
      })
    })

  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
