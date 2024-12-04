import { UserEmail } from "../value-object/user-email";
import { UserName } from "../value-object/user-name";
import { UserPhone } from "../value-object/user-phone";
import { Address } from "./address.entity";


export class Client {
    user_id: string;
    user_email: UserEmail;
    user_name: UserName;
    user_phone: UserPhone;
    user_image: string;
    user_addres: Address[];

    constructor(
        user_id: string,
        user_email: string,
        user_name: string,
        user_phone:string,
        user_image: string,
        addresses: Address[]=[]
    ){
        this.user_id= user_id;
        this.user_email= new UserEmail(user_email);
        this.user_name= new UserName(user_name);
        this.user_phone= new UserPhone(user_phone);
        this.user_image = user_image;
        this.user_addres = addresses;
    }

}

