import { GetComboServiceResponseDto } from "src/combo/application/dto/response/get-combo-response.dto";
import { Combo } from "../typeorm/combo-entity";


export class ComboMapper {

    static mapComboToResponse(combo: Combo): GetComboServiceResponseDto {
        return {
            id : combo.combo_id,
            name : combo.combo_name.getValue(),
            description : combo.combo_description.getValue(),
            price : combo.combo_price.getValue(),
            weight: combo.combo_weight.getValue(),
            measurement: combo.combo_measurement.getValue(),
            currency : combo.combo_currency.getValue(),
            stock: combo.combo_stock.getValue(),
            images: combo.combo_images.map(image => image.getValue()),
            categories: combo.combo_categories.map(category => category.category_id),
            products: combo.products.map(product => product.product_id),
            caducityDate: combo.combo_caducity_date ? combo.combo_caducity_date.getValue() : null,
            discount: combo.discount ? combo.discount.discount_id : null,
            discountPercentage: combo.discount ? combo.discount.discount_percentage.getValue() : null
        }
    }
    
}