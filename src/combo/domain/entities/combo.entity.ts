import { Product } from "src/product/domain/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class Combo {

    @PrimaryGeneratedColumn('uuid')
    combo_id: number;

    @Column('text')
    combo_name: string;

    @Column('decimal', {default: 0.00})
    combo_price: number;

    @Column('text')
    combo_description: string;

    @Column()
    combo_currency: string;

    @Column('text')
    combo_category: string;

    @Column()
    combo_image: string;

    @ManyToMany(() => Product, (product) => product.combos)
    products: Product[];

}