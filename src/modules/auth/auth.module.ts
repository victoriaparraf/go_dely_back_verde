import { Module } from '@nestjs/common';
import { AuthController } from './application/auth.controller';
import { AuthService } from './application/auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';

@Module({
  controllers: [AuthController],
  providers: [AuthService],
  imports: [TypeOrmModule.forFeature([ User ])],
  exports: [ TypeOrmModule ]
})
export class AuthModule {}
