import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, ManyToOne, OneToMany } from "typeorm";
import { Product } from "src/product/infrastructure/typeorm/product-entity";
import { ComboName } from "src/combo/domain/value-objects/combo-name.vo";
import { ComboDescription } from "src/combo/domain/value-objects/combo-description.vo";
import { ComboPrice } from "src/combo/domain/value-objects/combo-price.vo";
import { ComboCurrency } from "src/combo/domain/value-objects/combo-currency.vo";
import { ComboStock } from "src/combo/domain/value-objects/combo-stock.vo";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";
import { CategoryEntity } from "src/category/infrastructure/typeorm/category-entity";
import { OrderCombo } from "src/order/infraestructure/typeorm/order-combo";
import { Currency } from "src/common/domain/enums/currency.enum";
import { ComboWeight } from "src/combo/domain/value-objects/combo-weight.vo";
import { ComboMeasurement } from "src/combo/domain/value-objects/combo-measurement.vo";
import { ComboCaducityDate } from "src/combo/domain/value-objects/combo-caducity-date.vo";
import { ComboImage } from "src/combo/domain/value-objects/combo-image.vo";

@Entity()
export class Combo {

    @PrimaryGeneratedColumn('uuid')
    combo_id: string;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: ComboName) => value.getValue(),
        from: (value: string) => value ? new ComboName(value) : new ComboName('Combo'),
        },
    })
    combo_name: ComboName;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: ComboDescription) => value.getValue(),
        from: (value: string) => value ? new ComboDescription(value) : new ComboDescription('Descripcion'),
        },
    })
    combo_description: ComboDescription;

    @Column({
        type: 'decimal',
        transformer: {
        to: (value: ComboPrice) => value.getValue(),
        from: (value: number) => value ? new ComboPrice(value) : new ComboPrice(0),
        },
    })
    combo_price: ComboPrice;

    @Column({
        type: 'decimal',
        transformer: {
            to: (value: ComboWeight) => value.getValue(),
            from: (value: number) => value ? new ComboWeight(value) : new ComboWeight(0),
        },
    })
    combo_weight: ComboWeight;

    @Column({
        type: 'varchar',
        transformer: {
            to: (value: ComboMeasurement) => value.getValue(),
            from: (value: string) => value ? new ComboMeasurement(value): new ComboMeasurement('ml'),
        },
    })
    combo_measurement: ComboMeasurement;

    @Column({
        type: 'varchar',
        transformer: {
        to: (value: ComboCurrency) => value.getValue(),
        from: (value: string) => value ? new ComboCurrency(value as Currency) : new ComboCurrency('USD' as Currency),
        },
    })
    combo_currency: ComboCurrency;

    @ManyToMany(() => CategoryEntity, (category) => category.combos, { cascade: true })
    @JoinTable({
        name: 'combo_categories',
        joinColumn: { name: 'combo_id', referencedColumnName: 'combo_id' },
        inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' },
    })
    combo_categories: CategoryEntity[];

    @Column({
        type: 'int',
        default: 0,
        transformer: {
            to: (value: ComboStock) => value.getValue(),
            from: (value: number) => value? new ComboStock(value) : new ComboStock(0),
        },
    })
    combo_stock: ComboStock;

    @Column('text' , { array: true })
    combo_images: string[];

    @Column({
        type: 'date',
        nullable: true,
        transformer: {
            to: (value: ComboCaducityDate | null) => value.getValue().toISOString().split('T')[0],
            from: (value: Date | null) => value ? new ComboCaducityDate(value) : null,
        },
    })
    combo_caducity_date: ComboCaducityDate;

    @ManyToMany(() => Product, product => product.combos)
    @JoinTable({
        name: 'combo_products',
        joinColumn: { name: 'combo_id', referencedColumnName: 'combo_id' },
        inverseJoinColumn: { name: 'product_id', referencedColumnName: 'product_id' },
    })
    products: Product[];

    // @ManyToOne(() => Discount, (discount) => discount.combos, { nullable: true })
    // discount: Discount;

    @OneToMany(() => OrderCombo, orderCombo => orderCombo.combo)
    orders: OrderCombo[];
}
