import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

export enum PermissionType {
    PUBLIC = "public",
    ACCEPT_FOR = "accept_for",
    DENY_FOR = "deny_for"
}

@Entity()
export class permissions {

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
        enum: PermissionType,
        default: PermissionType.PUBLIC
    })
    status: PermissionType;
}