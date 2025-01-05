import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Product } from "./product-entity";

@Entity()
export class Image {

    @PrimaryGeneratedColumn()
    image_id: number;

    @Column('text')
    image_url: string;

    @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
    product: Product;

}
