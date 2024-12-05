import { Module } from '@nestjs/common';
import { UserService } from './infrastructure/user.service';
import { UserController } from './infrastructure/user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/product/infrastructure/cloudinary/cloudinary.module';
import { Address } from './infrastructure/Typeorm/address.entity';
import { User } from './infrastructure/Typeorm/user.entity';


@Module({
  imports: [TypeOrmModule.forFeature([User, Address]),CloudinaryModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
