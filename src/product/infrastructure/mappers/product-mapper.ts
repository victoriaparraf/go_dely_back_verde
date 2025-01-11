import { GetProductServiceResponseDto } from 'src/product/application/dto/response/get-product-response.dto';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

export class ProductMapper {
  static mapProductToResponse(product: Product): GetProductServiceResponseDto {
    return {
      id: product.id,
      name: product.name.getValue(),
      description: product.description.getValue(),
      price: product.price.getValue(),
      currency: product.currency.getValue(),
      weight: parseFloat(product.weight.getValue()),
      measurement: product.measurement.getValue(),
      stock: product.stock.getValue(),
      categories: product.categories.map(category => category.id),
      images: product.images.map((img) => img.image_url),
      discount: product.discount ? Number(product.discount.discount_percentage) : null,
    };
  }
}