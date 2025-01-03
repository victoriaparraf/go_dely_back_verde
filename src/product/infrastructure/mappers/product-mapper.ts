import { GetProductServiceResponseDto } from 'src/product/application/dto/get-product-response.dto';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

export class ProductMapper {
  static mapProductToResponse(product: Product): GetProductServiceResponseDto {
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