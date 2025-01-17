import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable, ManyToOne, JoinColumn } from "typeorm";
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
import { OrderProduct } from "src/order/infraestructure/typeorm/order-product";
import { CategoryEntity } from "src/category/infrastructure/typeorm/category-entity";

@Entity()
export class Product {
  
  @PrimaryGeneratedColumn('uuid')
  product_id: string;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductName) => value.getValue(),
      from: (value: string) => value ? new ProductName(value) : new ProductName('Producto'),
    },
  })
  product_name: ProductName;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductDescription) => value.getValue(),
      from: (value: string) => value ? new ProductDescription(value) : new ProductDescription('Descripcion del producto'),
    },
  })
  product_description: ProductDescription;

  @Column({
    type: 'decimal',
    transformer: {
      to: (value: ProductPrice) => value.getValue(),
      from: (value: number) => value ? new ProductPrice(value) : new ProductPrice(0),
    },
  })
  product_price: ProductPrice;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductCurrency) => value.getValue(),
      from: (value: string) => value ? new ProductCurrency(value) : new ProductCurrency('USD'),
    },
  })
  product_currency: ProductCurrency;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductWeight) => value.getValue(),
      from: (value: string) => value ? new ProductWeight(value) : new ProductWeight('0'),
    },
  })
  product_weight: ProductWeight;

  @Column({
    type: 'varchar',
    transformer: {
      to: (value: ProductMeasurement) => value.getValue(),
      from: (value: string) => value ? new ProductMeasurement(value): new ProductMeasurement('ml'),
    },
  })
  product_measurement: ProductMeasurement;

  @Column({
    type: 'int',
    default: 0,
    transformer: {
      to: (value: ProductStock) => value.getValue(),
      from: (value: number) => value ? new ProductStock(value): new ProductStock(0),
    },
  })
  product_stock: ProductStock;

  @OneToMany(() => Image, (image) => image.product, { cascade: true })
  images: Image[];

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  product_category: CategoryEntity;

  @ManyToMany(() => Combo, (combo) => combo.products, {
    cascade: true,
  })
  @JoinTable({
    name: 'combo_productos',
    joinColumn: { name: 'product_id', referencedColumnName: 'product_id' },
    inverseJoinColumn: { name: 'combo_id', referencedColumnName: 'combo_id' },
  })
  combos: Combo[];

  @ManyToOne(
      () => Discount, 
      (discount) => discount.products, 
      { nullable: true, onDelete: 'SET NULL'}
  )
  discount?: Discount;
  
  @OneToMany(() => OrderProduct, orderProduct => orderProduct.product)
  orders: OrderProduct[];

}
