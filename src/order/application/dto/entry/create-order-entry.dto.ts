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
    paymentMethod: string
    currency: string
    total: number
    products?: ProductEntryDto[]
    combos?: ComboEntryDto[]
}