import { Product } from "src/product/domain/entities/product.entity";
import { CategoryDescription } from "./value-objects/category-description.vo";
import { CategoryName } from "./value-objects/category-name.vo";
import { Combo } from "src/combo/domain/entities/combo.entity";

export class Category {

    id: string;
    name: CategoryName;
    description: CategoryDescription;
    products: Product[];
    combos: Combo[];

    constructor(
        
        id: string,
        name: string,
        description: string,
        products: Product[] = [],
        combos: Combo[] = []
    ) {
        this.id = id;
        this.name = new CategoryName(name);
        this.description = new CategoryDescription(description);
        this.products = products;
        this.combos = combos;
    }

}
