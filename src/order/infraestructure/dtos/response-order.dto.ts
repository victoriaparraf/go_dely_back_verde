import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { OrderCombo } from "src/order/infraestructure/typeorm/order-combo";
import { OrderProduct } from "src/order/infraestructure/typeorm/order-product";

export class ResponseOrderDTO {
    @ApiProperty()
    order_id: string;

    @ApiProperty()
    incremental_id: number;

    @ApiProperty()
    address: string;

    @ApiProperty()
    longitude: number;

    @ApiProperty()
    latitude: number;

    @ApiProperty()
    currency: string;

    @ApiProperty()
    total: number;

    @ApiProperty()
    paymentMethod: string;

    @ApiProperty()
    user_id: string;

    @ApiProperty()
    status: string;

    @ApiProperty({ type: () => [OrderProduct]})
    @Type(() => OrderProduct)
    products: {
        order_id: string;
        product_id: string;
        quantity: number;
        product_price?: number;
        total_price?: number;
        product_name?: string;
        product_description?: string;
        product_currency?: string;
        product_weight?: string;
        product_measurement?: string;
        product_stock?: number;
    }[];

    @ApiProperty({ type: () => [OrderCombo]})
    @Type(() => OrderCombo)
    combos: {
        order_id: string,
        combo_id: string,
        quantity: number,
        combo_price: number,
        total_price: number,
        combo_name: string,
        combo_description: string,
        combo_currency: string,
        combo_stock: number
    }[];

    @ApiProperty({ required: false })
    cupon_code?: string;

}
