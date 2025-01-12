import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Product } from 'src/product/infrastructure/typeorm/product-entity';
import { Combo } from 'src/combo/infrastructure/typeorm/combo-entity';

@Entity('categories')
export class CategoryEntity {

  @PrimaryGeneratedColumn('uuid')
  category_id: string;

  @Column({ type: 'varchar' })
  category_name: string;

<<<<<<< HEAD
  @Column({ type: 'text', nullable: true })
  category_description?: string;
=======
  @Column({ type: 'varchar' })
  category_image: string;
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a

  @Column({ type: 'text', nullable: true })
  image?: string;

  @OneToMany(() => Product, (product) => product.categories)
  products: Product[];

  @ManyToMany(() => Combo, combo => combo.combo_categories)
  combos: Combo[];

}
