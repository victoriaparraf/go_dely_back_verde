export interface ProductEntryDto {
    id: string;
    quantity: number;
}

export interface ComboEntryDto {
    id: string;
    quantity: number;
}

export interface CreateOrderServiceEntryDto{
    address: string
    longitude: number;
    latitude: number;
    paymentMethod: string
    currency: string
    total: number
    products?: ProductEntryDto[]
    combos?: ComboEntryDto[]
    cupon_code?: string
}