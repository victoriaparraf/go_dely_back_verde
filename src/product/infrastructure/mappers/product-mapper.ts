import { GetProductServiceResponseDto } from 'src/product/application/dto/response/get-product-response.dto';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

export class ProductMapper {
  static mapProductToResponse(product: Product): GetProductServiceResponseDto {
    return {
      id: product.product_id,
      name: product.product_name.getValue(),
      description: product.product_description.getValue(),
      price: product.product_price.getValue(),
      currency: product.product_currency.getValue(),
      weight: parseFloat(product.product_weight.getValue()),
      measurement: product.product_measurement.getValue(),
      stock: product.product_stock.getValue(),
      categories: product.product_category ? [product.product_category.category_id] : [],
      images: product.images.map((img) => img.image_url),
      discount: product.discount ? product.discount.discount_id : "",
    };
  }
}