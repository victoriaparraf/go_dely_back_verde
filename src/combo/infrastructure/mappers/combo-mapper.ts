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
            image: combo.combo_image,
            categories: combo.combo_categories.map(category => category.category_name),
            products: combo.products.map(product => product.product_name.getValue()),
            caducity_date: combo.combo_caducity_date ? combo.combo_caducity_date.getValue().toISOString().split('T')[0] : null,
            // discount: combo.discount ? Number(combo.discount.discount_percentage) : null,
        }
    }
    
}