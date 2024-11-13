import { Product } from "src/modules/product/domain/entities/product.entity";
import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";

@Entity()
export class Combo {

    @PrimaryGeneratedColumn()
    combo_id: number;

    @Column('text')
    combo_name: string;

    @Column('decimal', {default: 0.00})
    combo_price: number;

    @Column('text')
    combo_description: string;

    @ManyToMany(() => Product, (product) => product.combos)
    products: Product[];

}