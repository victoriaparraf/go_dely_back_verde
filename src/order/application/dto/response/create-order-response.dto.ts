export interface CreateOrderServiceResponseDto{

    order_id: string;
    address: string;
    currency: string;
    total: number;
    paymentMethod: string;
    user_id: string;
    status: string;

    order_products: {
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

    order_combos: {
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
}