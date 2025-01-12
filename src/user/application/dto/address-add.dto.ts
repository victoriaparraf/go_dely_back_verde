import {IsBoolean, IsNumber, IsString, MinLength } from "class-validator"


export class AddAddressDto {

    @IsString()
    @MinLength(4)
    name: string;

    @IsNumber()
    latitude: number;

    @IsNumber()
    longitude: number;

    @IsBoolean()
    favorite: boolean = true;
}
