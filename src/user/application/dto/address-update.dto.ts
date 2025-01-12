import { IsBoolean, IsNumber, IsOptional, IsString, MinLength } from "class-validator";


export class UpdateAddressDto {
    
    @IsString()
    id:string;
    
    @IsString()
    @IsOptional()
    @MinLength(4)
    name:string

    
    @IsNumber()
    @IsOptional()
    latitude:number

    
    @IsNumber()
    @IsOptional()
    longitude:number

    @IsBoolean()
    @IsOptional()
    favorite: boolean;
}