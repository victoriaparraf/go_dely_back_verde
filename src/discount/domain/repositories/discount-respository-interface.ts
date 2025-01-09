import { Discount } from "src/discount/infraestructure/typeorm/discount.entity";

export interface IDiscountRepository{
    createDiscount(discount: Discount): Promise<Discount>;
    saveDiscount(discount: Discount): Promise<Discount>;
    findAll(paginationDto: { page: number; perpage: number }): Promise<Discount[]>;
    findOne(term: string): Promise<Discount | undefined>;
    updateDiscount(discount: Discount): Promise<Discount>;
    removeDiscount(discount: Discount): Promise<Discount>;
}