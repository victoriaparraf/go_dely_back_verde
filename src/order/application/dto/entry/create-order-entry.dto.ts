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
    idPayment: string
    email?: string
    products?: ProductEntryDto[]
    combos?: ComboEntryDto[]
}