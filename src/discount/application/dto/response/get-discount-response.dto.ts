export class GetDiscountServiceResponseDto {

    id: string;
    name: string;
    description: string;
    percentage: number;
    startDate: Date  | string;
    deadline: Date  | string;
    image?: string;

}