import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { ProductRepository } from 'src/product/infrastructure/typeorm/product-repositoy';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { GetProductServiceEntryDto, GetProductServicePaginationDto } from '../dto/get-product-entry.dto';
import { GetProductServiceResponseDto } from '../dto/get-product-response.dto';
import { ProductMapper } from 'src/product/infrastructure/mappers/product-mapper';

@Injectable()
export class GetProductService implements IApplicationService<GetProductServiceEntryDto, GetProductServiceResponseDto> {
  constructor(
    private readonly productRepository: ProductRepository,
  ) {}

  async execute(entryDto: GetProductServiceEntryDto): Promise<GetProductServiceResponseDto> {
    const product = await this.productRepository.findOne(entryDto.term);
    if (!product) {
      throw new NotFoundException(`Product with term ${entryDto.term} not found`);
    }
    return ProductMapper.mapProductToResponse(product);
  }

  async findAll(paginationDto: GetProductServicePaginationDto): Promise<GetProductServiceResponseDto[]> {
    const products = await this.productRepository.findAll(paginationDto);
    return products.map(product => ProductMapper.mapProductToResponse(product));
  }
}