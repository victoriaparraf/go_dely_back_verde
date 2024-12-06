
export class ResponseAddressDto{
    address_id: string;
    latitude: number;
    longitude: number;
    name: string;
    user_id: string;

    constructor(
        address_id: string,
        latitude: number,
        longitude: number,
        name: string,
        user_id: string
    ){
        this.address_id= address_id;
        this.latitude= latitude;
        this.longitude = longitude;
        this.name = name;
        this.user_id= user_id;
    }

}