import { Product } from "src/product/domain/entities/product.entity";

export class Combo {
    combo_id: string;
    combo_name: string;
    combo_price: number;
    combo_description: string;
    combo_currency: string;
    combo_category: string;
    combo_image: string;
    products: Product[];
}
