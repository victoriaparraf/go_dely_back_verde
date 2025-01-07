import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';

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

  @ManyToMany(() => Combo, combo => combo.combo_categories)
  combos: Combo[];

}
