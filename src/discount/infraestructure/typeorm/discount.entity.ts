import { Product } from "src/product/infrastructure/typeorm/product-entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Discount {
    
    @PrimaryGeneratedColumn('uuid')
    discount_id: string;

    @Column('decimal', { default: 0.00 })
    discount_percentage: number;

    @Column({ type: 'date' })  
    discount_start_date: Date;

    @Column({ type: 'date' }) 
    discount_end_date: Date;

    @OneToMany(() => Product, (product) => product.discount)
    products: Product[];
}