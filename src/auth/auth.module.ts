import { Module } from '@nestjs/common';
import { AuthController } from './infrastructure/auth.controller';
import { AuthService } from './infrastructure/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './infrastructure/typeorm/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './infrastructure/jwt/strategies/jwt.strategy';

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
          expiresIn: '2h'
        }
      })
    })

  ],
  exports: [ TypeOrmModule, JwtStrategy, PassportModule, JwtModule ]
})
export class AuthModule {}
