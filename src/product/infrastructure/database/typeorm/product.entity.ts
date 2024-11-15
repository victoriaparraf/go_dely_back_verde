import { Entity, PrimaryColumn, Column, OneToMany, ManyToOne, JoinTable, ManyToMany } from 'typeorm';
import { ImageEntity } from './image.entity';
import { Combo } from 'src/combo/domain/entities/combo.entity';

@Entity('products')
export class ProductEntity {
  @PrimaryColumn()
  product_id: string;

  @Column()
  product_name: string;

  @Column()
  product_description: string;

  @Column()
  product_price: number;

  @Column()
  product_currency: string;

  @Column()
  product_weight: string;

  @Column()
  product_stock: number;

  @Column()
  product_category: string;

  @OneToMany(() => ImageEntity, image => image.product)
  images: ImageEntity[];

  @ManyToMany(() => Combo, (combo) => combo.products)
    @JoinTable({
        name: 'product_combo',
        joinColumn: {
            name: 'product_id'
        },
        inverseJoinColumn: {
            name: 'combo_id'
        }
    })
    combos: Combo[];
}
