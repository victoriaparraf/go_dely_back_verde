import { ClientName } from "../value-object/client-name";
import { ClientPhone } from "../value-object/client-phone";
import { Address } from "./address.entity";


export class Client {
    client_id: string;
    client_name: ClientName;
    client_phone: ClientPhone;
    client_image: string;
    client_addres: Address[];

    constructor(
        client_id: string,
        client_name: string,
        client_phone:string,
        client_image: string,
        addresses: Address[]=[]
    ){
        this.client_id= client_id;
        this.client_name= new ClientName(client_name);
        this.client_phone= new ClientPhone(client_phone);
        this.client_image = client_image;
        this.client_addres = addresses;
    }

}

