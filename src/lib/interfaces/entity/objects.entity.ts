import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class objects {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    profile: string;

    @Column()
    hub: string;
    
}