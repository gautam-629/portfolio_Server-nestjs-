import { IsOptional, IsString } from "class-validator";

export class UpdateProfilePictureDto{
    @IsOptional()
    @IsString()
    imageUrl:string
}