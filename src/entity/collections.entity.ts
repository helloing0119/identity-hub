import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class collections {
    
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type : "timestamptz"})
    createdAt: string;

    @Column({ type : "uuid"})
    object: string;

    @Column()
    hub: string;

    @Column()
    profile: string;

    @Column()
    clientKeyId: string;

    @Column()
    prevRev: string;

    @Column()
    rev: string;

    @Column()
    note: string;

    @Column()
    vaultDID: string;

    @Column()
    type: string;

    @Column()
    metadata: string;
}