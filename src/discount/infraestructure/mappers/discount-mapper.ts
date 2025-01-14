import { GetDiscountServiceResponseDto } from "src/discount/application/dto/response/get-discount-response.dto";
import { Discount } from "../typeorm/discount.entity";

export class DiscountMapper {

    static mapDiscountToResponse(discount: Discount): GetDiscountServiceResponseDto {
        return {
            id : discount.discount_id,
            name : discount.discount_name.getValue(),
            description : discount.discount_description.getValue(),
            percentage: discount.discount_percentage.getValue(),
            startDate: discount.discount_start_date.getValue(),
            deadline: discount.discount_end_date.getValue(),
            image: discount.discount_image ? discount.discount_image.getValue() : null,
        }
    }
    
}