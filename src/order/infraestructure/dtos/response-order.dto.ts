import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { OrderCombo } from "src/order/infraestructure/typeorm/order-combo";
import { OrderProduct } from "src/order/infraestructure/typeorm/order-product";

export class ResponseOrderDTO {
    @ApiProperty()
    id: string;

    @ApiProperty()
    incremental_id: number;

    @ApiProperty()
    createdDate: Date;

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
        quantity: number;
        id: string;
        price?: number;
        total_price?: number;
        name?: string;
        description?: string;
        currency?: string;
        weight?: string;
        measurement?: string;
        stock?: number;
        images: string[];
    }[];

    @ApiProperty({ type: () => [OrderCombo]})
    @Type(() => OrderCombo)
    combos: {
        quantity: number,
        id: string,
        price: number,
        total_price: number,
        name: string,
        description: string,
        currency: string,
        stock: number
    }[];

    @ApiProperty({ required: false })
    cupon_code?: string;

}
