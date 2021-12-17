import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class profiles {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column()
    profile: string;

    @Column()
    hub: string;

}