import { Product } from '../entities/product.entity';

export interface IProductRepository {
  find(arg0: { skip: number; take: number; relations: string[]; }): unknown;
  create(product: Product): Promise<Product>;
  findById(productId: string): Promise<Product | null>;
  findAll(): Promise<Product[]>;
  update(productId: string, product: Product): Promise<Product>;
  remove(productId: string): Promise<void>;
}
