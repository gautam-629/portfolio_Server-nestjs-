import { Project } from "../../projects/entities/project.entity";
import { User } from "../../user/entity/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('techs')
export class TechStack {
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({
        length:100,
        type:'varchar'
    })
    title:string

    @Column({
        type:'text',
        nullable:true
    })
    description:string

    @CreateDateColumn()
    createdAt:Date;

    @ManyToOne(()=>User)
    @JoinColumn({
        name:'createdBy'
    })
    createdBy:User

    @ManyToMany(()=>Project,project=>project.techs)
    project:Project[]
}
