import { Column, Entity, JoinTable, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Product } from "src/product/infrastructure/typeorm/product-entity";
import { DiscountPercentage } from "src/discount/domain/value-objects/discount-percentage.vo";
import { DiscountStartDate } from "src/discount/domain/value-objects/discount-start-date.vo";
import { DiscountEndDate } from "src/discount/domain/value-objects/discount-end-date.vo";
import { Combo } from "src/combo/infrastructure/typeorm/combo-entity";


@Entity()
export class Discount {
    
    @PrimaryGeneratedColumn('uuid')
    discount_id: string;

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

    // @OneToMany(() => Combo, (combo) => combo.discount, { nullable: true })
    // combos: Combo[];
}