import { IsArray, IsInt, IsNumber, IsOptional, IsPositive, IsString, IsUUID, Length, MinLength } from "class-validator";

export class CreateProductDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    @IsPositive()
    price: number;

    @IsString()
    @Length(3, 3)
    currency: string;

    @IsNumber()
    @IsPositive()
    weight: number;

    @IsString()
    @Length(2, 2)
    measurement: string;

    @IsInt()
    @IsOptional()
    @IsPositive()
    stock?: number;

    @IsString({ each:true })
    @IsArray()
    images: string[];

    @IsArray()
    categories: string[];

}
