import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column(() => String)
  category_name: string;

  @Column(() => String)
  category_description: string;

  @OneToMany(() => Product, (product) => product.category, { cascade: true })
  products: Product[];
}
