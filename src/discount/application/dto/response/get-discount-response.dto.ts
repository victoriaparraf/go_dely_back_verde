export class GetDiscountServiceResponseDto {

    id: string;
    name: string;
    description: string;
    percentage: number;
    initDate: Date  | string;
    expireDate: Date  | string;
    image?: string;

}