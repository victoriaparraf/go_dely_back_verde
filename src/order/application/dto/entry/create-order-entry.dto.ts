export interface ProductEntryDto {
    quantity: number;
    product_id: string;
    product_price: number;
    product_quantity: number;
}

export interface ComboEntryDto {
    quantity: number;
    combo_id: string;
    combo_price: number;
    combo_quantity: number;
}

export interface CreateOrderServiceEntryDto{
    address_id: string
    paymentMethodId: string
    currency: string
    total: number
    order_products?: ProductEntryDto[]
    order_combos?: ComboEntryDto[]
}