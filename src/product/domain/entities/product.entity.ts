import { Combo } from "src/combo/domain/entities/combo.entity";
import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";
import { Image } from "./image.entity"; 

export class Product {
    product_id: string;
    product_name: string;
    product_description?: string;
    product_price: number;
    product_currency: string;
    product_weight: string;
    product_stock: number;
    product_category: string;
    images: Image[];
    combos: Combo[];
    discount?: Discount;
}
