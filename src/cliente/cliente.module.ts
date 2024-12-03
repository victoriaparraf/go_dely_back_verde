import { Module } from '@nestjs/common';
import { ClientService } from './infrastructure/cliente.service';
import { ClientController } from './infrastructure/cliente.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CloudinaryModule } from 'src/product/infrastructure/cloudinary/cloudinary.module';
import { Client } from './infrastructure/Typeorm/cliente.entity';
import { Address } from './infrastructure/Typeorm/address.entity';


@Module({
  imports: [TypeOrmModule.forFeature([Client, Address]),CloudinaryModule],
  controllers: [ClientController],
  providers: [ClientService],
})
export class ClientModule {}
