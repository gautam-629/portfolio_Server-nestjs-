import { User } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('profile_pictures')
export class ProfilePicture{
   @PrimaryGeneratedColumn()
   id:string

   @Column()
   imageUrl:string
   
   @CreateDateColumn()
   uploadedAt:Date

   @ManyToOne(()=>User,(user)=>user.profilePictures,{onDelete:'CASCADE',onUpdate:'CASCADE'})
   user:User
   
}