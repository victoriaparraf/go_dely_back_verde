import { AggregateRoot } from "src/common/domain/aggregate.root";
import { DiscountID } from "./value-objects/discount-id.vo";
import { DiscountName } from "./value-objects/discount-name.vo";
import { DiscountDescription } from "./value-objects/discount-description.vo";
import { DiscountPercentage } from "./value-objects/discount-percentage.vo";
import { DiscountStartDate } from "./value-objects/discount-start-date.vo";
import { DiscountEndDate } from './value-objects/discount-end-date.vo';
import { Product } from "src/product/domain/entities/product.entity";
import { Combo } from "src/combo/domain/entities/combo.entity";
import { DiscountImage } from "./value-objects/discount-image.vo";
import { DiscountCreatedEvent } from "./events/discount-created.event";
import { unvalidDiscountException } from "./exceptions/unvalid-discount";

export class Discount extends AggregateRoot<DiscountID>{
    
    private name: DiscountName;
    private description: DiscountDescription;
    private percentage: DiscountPercentage;
    private start_date: DiscountStartDate;
    private end_date: DiscountEndDate;
    private products?: Product[];
    private combos?: Combo[];
    private image?: DiscountImage;

    get Name(): DiscountName{
        return this.name;
    }

    get Description(): DiscountDescription{
        return this.description;
    }

    get Percentage(): DiscountPercentage{
        return this.percentage
    }

    get StartDate(): DiscountStartDate{
        return this.start_date;
    }

    get EndDate(): DiscountEndDate{
        return this.EndDate;
    }

    get Products(): Product[] {
        return this.products;
    }

    get Combos(): Combo[]{
        return this.combos;
    }

    get Image(): DiscountImage{
        return this.image;
    }

    constructor(

        id: DiscountID,
        name: DiscountName,
        description: DiscountDescription,
        start_date: DiscountStartDate,
        end_date: DiscountEndDate,
        products?: Product[],
        combos?: Combo[],
        image?: DiscountImage

    ){
        const createdDiscount = DiscountCreatedEvent.create(id, name, description, start_date, end_date, products, combos, image)

        super(id);
        this.isValidDiscount();
        super.addDomainEvent(createdDiscount);
    }

    protected isValidDiscount(): void{
        if( !this.name || !this.description || !this.start_date || !this.end_date || !this.percentage )
            throw new unvalidDiscountException('Not valid Discount');
    }

}