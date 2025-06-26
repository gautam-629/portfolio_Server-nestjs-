import { Expose, Transform } from "class-transformer";
import { domain } from "src/common/const";

export class ProfileDto{
    @Expose()
    id:string;

    @Expose()
    @Transform(({value})=>`${domain}${value}`,{toClassOnly:true})
    imageUrl:string;

    @Expose()
    email:string

    @Expose()
    firstName:string

    @Expose()
    lastName:String
}