import { Product } from "src/product/domain/entities/product.entity";
import { CategoryDescription } from "./value-objects/category-description.vo";
import { CategoryName } from "./value-objects/category-name.vo";

export class Category {

    category_id: string;
    category_name: CategoryName;
    category_description: CategoryDescription;
    products: Product[];

    constructor(
        
        id: string,
        name: string,
        description: string,
        products: Product[] = []
    ) {
        this.category_id = id;
        this.category_name = new CategoryName(name);
        this.category_description = new CategoryDescription(description);
        this.products = products;
    }

}
