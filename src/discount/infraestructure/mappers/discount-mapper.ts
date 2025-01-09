import { GetDiscountServiceResponseDto } from "src/discount/application/dto/response/get-discount-response.dto";
import { Discount } from "../typeorm/discount.entity";

export class DiscountMapper {

    static mapDiscountToResponse(discount: Discount): GetDiscountServiceResponseDto {
        return {
            id : discount.discount_id,
            name : discount.discount_name.getValue(),
            description : discount.discount_description.getValue(),
            percentage: discount.discount_percentage.getValue(),
            start_date: discount.discount_start_date.getValue(),
            end_date: discount.discount_end_date.getValue(),
            image: discount.discount_image ? discount.discount_image : null,
            products: discount.products ? discount.products.map(product => product.product_name.getValue()) : null,
            combos: discount.combos ? discount.combos.map(combo => combo.combo_name.getValue()) : null,
        }
    }
    
}