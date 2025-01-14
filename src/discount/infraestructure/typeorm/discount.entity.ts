import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "src/product/infrastructure/typeorm/product-entity";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage.vo";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date.vo";
import { DiscountEndDate } from "src/discount/domain/value-objects/discount-end-date.vo";
import { DiscountName } from "src/discount/domain/value-objects/discount-name.vo";
import { DiscountDescription } from "src/discount/domain/value-objects/discount-description.vo";
import { Combo } from "src/combo/infrastructure/typeorm/combo-entity";
import { DiscountImage } from "src/discount/domain/value-objects/discount-image.vo";


@Entity()
export class Discount {
    
    @PrimaryGeneratedColumn('uuid')
    discount_id: string;

    @Column({
        type: 'varchar',
        transformer: {
            to: (value: DiscountName) => value.getValue(),
            from: (value: string) => value ? new DiscountName(value) : new DiscountName('Discount'),
        },
    })
    discount_name: DiscountName;

    @Column({
        type: 'varchar',
        transformer: {
            to: (value: DiscountDescription) => value.getValue(),
            from: (value: string) => value ? new DiscountDescription(value) : new DiscountDescription('Descripcion'),
        },
    })
    discount_description: DiscountDescription;

    @Column({
        type: 'decimal',
        default: 0.00,
        transformer: {
            to: (value: DiscountPercentage) => value.getValue(),
            from: (value: number) => new DiscountPercentage(value),
        },
    })
    discount_percentage: DiscountPercentage;

    @Column({
        type: 'date',
        transformer: {
            to: (value: DiscountStartDate) => value instanceof DiscountStartDate ? value.getValue() : value,
            from: (value: Date) => new DiscountStartDate(value),
        },
    })
    discount_start_date: DiscountStartDate;
    
    @Column({
        type: 'date',
        transformer: {
            to: (value: DiscountEndDate) => value instanceof DiscountEndDate ? value.getValue() : value,
            from: (value: Date) => new DiscountEndDate(value),
        },
    })
    discount_end_date: DiscountEndDate;

    @OneToMany(() => Product, (product) => product.discount, { nullable: true })
    products: Product[];

    @OneToMany(() => Combo, (combo) => combo.discount, { nullable: true })
    combos: Combo[];

    @Column('text', { 
        transformer: {
            to: (value: DiscountImage) => value.getValue(),
            from: (value: string) => value ? new DiscountImage(value) : new DiscountImage('url'),
        },
    })
    discount_image: DiscountImage;
}