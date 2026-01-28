import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Project } from "./project.entity";

@Entity('project_pictures')
export class ProjectPhotos{
    @PrimaryGeneratedColumn('uuid')
    id:string

    @Column({
        type:'varchar',
        length:255
    })
    imageUrl:string

    @ManyToOne(()=>Project,(project)=>project.photos)
    project:Project

}