import { Product } from 'src/product/infrastructure/typeorm/product-entity';

export interface IProductRepository {
  createProduct(product: Product): Promise<Product>;
  saveProduct(product: Product): Promise<Product>;
  findAll(paginationDto: { page: number; perpage: number }): Promise<Product[]>;
  findOne(term: string): Promise<Product | undefined>;
  updateProduct(product: Product): Promise<Product>;
  removeProduct(product: Product): Promise<Product>;
  deleteImagesByProduct(productId: string): Promise<void>;
}