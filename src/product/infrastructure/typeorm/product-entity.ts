import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne } from "typeorm";
import { Image } from "./image-entity";
import { Combo } from "src/combo/infrastructure/typeorm/combo-entity";
import { ProductName } from "src/product/domain/value-objects/product-name.vo";
import { ProductDescription } from "src/product/domain/value-objects/product-description.vo";
import { ProductPrice } from "src/product/domain/value-objects/product-price.vo";
import { ProductCurrency } from "src/product/domain/value-objects/poduct-currency.vo";
import { ProductMeasurement } from "src/product/domain/value-objects/product-measurement.vo";
import { ProductWeight } from "src/product/domain/value-objects/product-weight.vo";
import { ProductStock } from "src/product/domain/value-objects/product-stock.vo";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";

@Entity()
export class Product {
  
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductName) => value.getValue(),
      from: (value: string) => new ProductName(value),
    },
  })
  product_name: ProductName;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductDescription) => value.getValue(),
      from: (value: string) => new ProductDescription(value),
    },
  })
  product_description: ProductDescription;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: ProductPrice) => value.getValue(),
      from: (value: number) => new ProductPrice(value),
    },
  })
  product_price: ProductPrice;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductCurrency) => value.getValue(),
      from: (value: string) => new ProductCurrency(value),
    },
  })
  product_currency: ProductCurrency;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductWeight) => value.getValue(),
      from: (value: string) => new ProductWeight(value),
    },
  })
  product_weight: ProductWeight;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductMeasurement) => value.getValue(),
      from: (value: string) => new ProductMeasurement(value),
    },
  })
  product_measurement: ProductMeasurement;

  @Column({
    type: 'int',
    default: 0,
    transformer: {
      to: (value: ProductStock) => value.getValue(),
      from: (value: number) => new ProductStock(value),
    },
  })
  product_stock: ProductStock;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @Column('text')
  product_category: string;

  @ManyToMany(() => Combo, combo => combo.products)
  combos: Combo[];

    @ManyToOne(
        () => Discount, 
        (discount) => discount.products, 
        { nullable: true }
    )
    discount?: Discount;
  
}
