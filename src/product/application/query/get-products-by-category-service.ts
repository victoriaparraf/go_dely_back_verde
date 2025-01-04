import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductMapper } from 'src/product/infrastructure/mappers/product-mapper';
import { GetProductServiceResponseDto } from '../dto/response/get-product-response.dto';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';

@Injectable()
export class GetProductsByCategoryService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(categoryId: string): Promise<GetProductServiceResponseDto[]> {
    const products = await this.productRepository.findByCategory(categoryId);
    if (!products.length) {
      throw new NotFoundException(`No products found for category ID ${categoryId}`);
    }
    return products.map(product => ProductMapper.mapProductToResponse(product));
  }
}