import { ResponseAddressDto } from "src/user/application/dto/response-addres.dto";
import { Address } from "../typeorm/address-entity";
import { UserMapper } from "./user.mapper";

export class AddressMapper {
    static toDtoAddres( address: Address){
        return new ResponseAddressDto(
            address.address_id,
            address.latitude,
            address.longitude,
            address.name,
            address.favorite,
            UserMapper.toDTO(address.user).id
        )
    }
}
