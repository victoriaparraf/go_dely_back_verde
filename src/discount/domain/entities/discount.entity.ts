import { Product } from "src/product/domain/entities/product.entity";
import { DiscountPercentage } from "../value-objects/discount-percentage.vo";
import { DiscountStartDate } from "../value-objects/discount-start-date.vo";
import { DiscountEndDate } from "../value-objects/discount-end-date.vo";


export class Discount {

    discount_id: string;
    discount_percentage: DiscountPercentage;
    discount_start_date: DiscountStartDate;
    discount_end_date: DiscountEndDate;
    products: Product[];

    constructor(
        id: string,
        percentage: number,
        startDate: Date,
        endDate: Date,
        products: Product[] = []
    ) {
        this.discount_id = id;
        this.discount_percentage = new DiscountPercentage(percentage);
        this.discount_start_date = new DiscountStartDate(startDate);
        this.discount_end_date = new DiscountEndDate(endDate);
        this.products = products;
    }

    isActive(): boolean {
        const now = new Date();
        return now >= this.discount_start_date.getValue() && now <= this.discount_end_date.getValue();
    }
}
