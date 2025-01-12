import { Product } from "src/product/domain/entities/product.entity";
import { DiscountPercentage } from "../value-objects/discount-percentage.vo";
import { DiscountStartDate } from "../value-objects/discount-start-date.vo";
import { DiscountEndDate } from "../value-objects/discount-end-date.vo";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { DiscountName } from "../value-objects/discount-name.vo";
import { DiscountDescription } from "../value-objects/discount-description.vo";
import { DiscountImage } from "../value-objects/discount-image.vo";


export class Discount {

    discount_id: string;
    discount_name: DiscountName;
    discount_description: DiscountDescription;
    discount_percentage: DiscountPercentage;
    discount_start_date: DiscountStartDate;
    discount_end_date: DiscountEndDate;
    products?: Product[];
    combos?: Combo[];
    discount_image?: DiscountImage;

    constructor(
        id: string,
        name: string,
        description: string,
        percentage: number,
        startDate: Date | string,
        endDate: Date | string,
        products?: Product[],
        combos?: Combo[],
        image?: string,
    ) {
        this.discount_id = id;
        this.discount_name = new DiscountName(name);
        this.discount_description = new DiscountDescription(description);
        this.discount_percentage = new DiscountPercentage(percentage);
        this.discount_start_date = new DiscountStartDate(startDate);
        this.discount_end_date = new DiscountEndDate(endDate);
        this.products = products;
        this.combos = combos
        this.discount_image = new DiscountImage(image);
    }

    isActive(): boolean {
        const now = new Date();
        return now >= this.discount_start_date.getValue() && now <= this.discount_end_date.getValue();
    }
}
