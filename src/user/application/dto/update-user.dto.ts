import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator"


export class UpdateUserDto{

    @IsString()
    @IsOptional()
    @IsEmail()
    user_email: string
  
    @IsString()
    @IsOptional()
    @MinLength(1)
    user_name: string;


    @IsOptional()
    @IsString()
    @MinLength(5)
    @MaxLength(20)
    @Matches(
        /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
        message: 'The password must have a Uppercase, lowercase letter and a number'
    })
    user_password: string;

    @IsOptional()
    @IsString()
    user_phone: string
    
    @IsString()
    @IsOptional()
    user_image: string

}