import { Injectable, NotFoundException } from '@nestjs/common';
import { IApplicationService } from 'src/common/application/application-service.interface';
import { ProductRepository } from 'src/product/infrastructure/typeorm/product-repositoy';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { GetProductServiceEntryDto, GetProductServicePaginationDto } from '../dto/get-product-entry.dto';
import { GetProductServiceResponseDto } from '../dto/get-product-response.dto';

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
    return this.mapProductToResponse(product);
  }

  async findAll(paginationDto: GetProductServicePaginationDto): Promise<GetProductServiceResponseDto[]> {
    const products = await this.productRepository.findAll(paginationDto);
    return products.map(product => this.mapProductToResponse(product));
  }

  private mapProductToResponse(product: Product): GetProductServiceResponseDto {
    return {
      product_id: product.product_id,
      product_name: product.product_name.getValue(),
      product_description: product.product_description.getValue(),
      product_price: product.product_price.getValue(),
      product_currency: product.product_currency.getValue(),
      product_weight: parseFloat(product.product_weight.getValue()),
      product_measurement: product.product_measurement.getValue(),
      product_stock: product.product_stock.getValue(),
      product_category: product.product_category?.category_name,
      images: product.images.map((img) => img.image_url),
      discount: product.discount ? Number(product.discount.discount_percentage) : null,
    };
  }
}