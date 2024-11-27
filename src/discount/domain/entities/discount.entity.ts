import { Product } from "src/product/domain/entities/product.entity";


export class Discount {

    discount_percentage: number;
    discount_start_date: Date;
    discount_end_date: Date;
    products: Product[];

}
