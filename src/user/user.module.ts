import { Module } from '@nestjs/common';
import { UserService } from './infrastructure/user.service';
import { UserController } from './infrastructure/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/common/infraestructure/cloudinary/cloudinary.module';
import { Address } from './infrastructure/typeorm/address-entity';
import { UserRepository } from './infrastructure/typeorm/user.repository';
import { User } from './infrastructure/typeorm/user-entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Address]),CloudinaryModule],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository, TypeOrmModule, UserService]
})
export class UserModule {}
