import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { ProductRepository } from 'src/product/infrastructure/repositories/product-repositoy';

@Injectable()
export class DeleteProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(productId: string): Promise<void> {
    const product = await this.productRepository.findOne(productId);
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    try {
      await this.productRepository.removeProduct(product);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new InternalServerErrorException('Unexpected error, check server logs');
    }
  }
}