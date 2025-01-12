import { Product } from "src/product/domain/entities/product.entity";
import { CategoryImage } from "./value-objects/category-image.vo";
import { CategoryName } from "./value-objects/category-name.vo";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { CategoryID } from "./value-objects/category-id.vo";

export class Category {

    category_id: CategoryID;
    category_name: CategoryName;
    category_image: CategoryImage;
    products: Product[];
    combos: Combo[];

    constructor(
        
        id: string,
        name: string,
        image: string,
        products: Product[] = [],
        combos: Combo[] = []
    ) {
        this.category_id = new CategoryID(id);
        this.category_name = new CategoryName(name);
        this.category_image = new CategoryImage(image);
        this.products = products;
        this.combos = combos;
    }

}
