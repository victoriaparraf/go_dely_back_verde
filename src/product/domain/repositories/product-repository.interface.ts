import { ProductEntity } from 'src/product/infrastructure/database/typeorm/product.entity';
import { Product } from '../entities/product.entity';

export interface IProductRepository {
  save(productEntity: ProductEntity): unknown;
  findOne(arg0: { where: { product_id: string; }; }): unknown;
  
  find(params: { skip: number; take: number; relations: string[] }): Promise<Product[]>;

  create(product: Product): Promise<Product>;

  findAll(): Promise<Product[]>;

  findById(productId: string): Promise<Product | null>;

  update(productId: string, product: Product): Promise<Product>;

  delete(productId: string): Promise<void>;
}
