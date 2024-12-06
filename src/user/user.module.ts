import { Module } from '@nestjs/common';
import { UserService } from './infrastructure/user.service';
import { UserController } from './infrastructure/cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/product/infrastructure/cloudinary/cloudinary.module';
import { Address } from './infrastructure/typeorm/address.entity';
import { User } from './infrastructure/typeorm/user.entity';
import { UserRepository } from './infrastructure/typeorm/user.repository';


@Module({
  imports: [TypeOrmModule.forFeature([User, Address]),CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, TypeOrmModule]
})
export class UserModule {}