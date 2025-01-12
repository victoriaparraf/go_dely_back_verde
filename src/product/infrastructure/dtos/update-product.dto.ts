import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from '../../infrastructure/dtos/create-product.dto';

export class UpdateProductDto extends PartialType(CreateProductDto) {}
