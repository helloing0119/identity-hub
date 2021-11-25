import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum StatusInfo {
    PENDING = "pending",
    ACCEPTED = "accepted",
    REJECTED = "rejected"
}

@Entity()
export class permission_requests {

    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({ type: "timestamptz" })
    createdAt: string;

    @Column({ type: "uuid" })
    object: string;

    @Column()
    profile: string;

    @Column()
    hub: string;

    @Column()
    grantee: string;

    @Column({
        type: "enum",
        enum: StatusInfo,
        default: StatusInfo.PENDING
    })
    status: StatusInfo;
}