import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';

@Entity('categories')
export class CategoryEntity {
  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ type: 'varchar', length: 255 })
  category_name: string;

  @Column({ type: 'text', nullable: true })
  category_description: string;

  @OneToMany(() => Product, (product) => product.product_category)
  products: Product[];
}
