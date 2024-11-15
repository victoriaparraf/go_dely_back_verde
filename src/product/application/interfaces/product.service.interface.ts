import { ProductDTO } from '../dtos/product.dto';
import { Product } from '../../domain/entities/product.entity';

export interface IProductService {
  createProduct(productDTO: ProductDTO): Promise<Product>;
  getProductById(productId: string): Promise<Product | null>;
  updateProduct(productId: string, productDTO: ProductDTO): Promise<Product>;
  removeProduct(productId: string): Promise<void>;
}
