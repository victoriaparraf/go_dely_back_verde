import { Product } from "src/product/domain/entities/product.entity";
import { CategoryImage } from "./value-objects/category-image.vo";
import { CategoryName } from "./value-objects/category-name.vo";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { CategoryID } from "./value-objects/category-id.vo";

export class Category {

<<<<<<< HEAD
    id: string;
    name: CategoryName;
    description: CategoryDescription;
=======
    category_id: CategoryID;
    category_name: CategoryName;
    category_image: CategoryImage;
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a
    products: Product[];
    combos: Combo[];

    constructor(
        
        id: string,
        name: string,
        image: string,
        products: Product[] = [],
        combos: Combo[] = []
    ) {
<<<<<<< HEAD
        this.id = id;
        this.name = new CategoryName(name);
        this.description = new CategoryDescription(description);
=======
        this.category_id = new CategoryID(id);
        this.category_name = new CategoryName(name);
        this.category_image = new CategoryImage(image);
>>>>>>> eb6487b6eeb771d2a390cfc9a7bacaa531607f4a
        this.products = products;
        this.combos = combos;
    }

}
