import { Injectable, RequestMethod } from '@nestjs/common';
import { Connection, getManager, getRepository, createConnection } from "typeorm";
import { objects } from './entity/objects.entity';
import { profiles } from './entity/profiles.entity';
import { collections } from './entity/collections.entity';
import { permission_requests, StatusInfo } from './entity/permission_requests.entity';
import { permissions, PermissionType } from './entity/permissions.entity';
import Commit from '../models/Commit';

export default class Store {
  private connection: Connection;

  async init(host: string, type: string, port: number, username: string, password: string, database: string) {
    this.connection = await createConnection({
      type: "postgres",
      host: host,
      port: port,
      username: username,
      password: password,
      database: database
    });
  }

  async getDID(profile: string): Promise<string> {
    // get hubDID by profile
    const obj =
      await getManager()
        .createQueryBuilder()
        .select('obj')
        .from(objects, 'obj')
        .where('obj.profile = :profile', { profile: profile })
        .getOne();
    return obj.hub;
  }

  async isRegistered(profile: string): Promise<Boolean> {
    const user = (
      await getManager()
        .createQueryBuilder()
        .select('p')
        .from(profiles, 'p')
        .where('p.profile = :profile', { profile: profile })
        .getOne()
    ) != null;

    return user;
  }

  async getHasPermission(objectId: string, profile: string): Promise<boolean> {
    const isOwner = (
      await getManager()
        .createQueryBuilder()
        .select('obj')
        .from(objects, 'obj')
        .where('obj.id = :objectId', { objectId: objectId })
        .andWhere('obj.profile = :profile', { profile: profile })
        .getOne()
    ) != null;

    if (isOwner) return true;

    const isPublic =
      (await getManager()
        .createQueryBuilder()
        .select('p')
        .from(permissions, 'p')
        .where('p.object = :objectId', { objectId: objectId })
        .andWhere('p.permissionType = :type', { type: PermissionType.PUBLIC })
        .getOne()
      ) != null;

    if (isPublic) return true;

    const isPermissionAccepted =
      (
        (
          await getManager()
            .createQueryBuilder()
            .select('p')
            .from(permissions, 'p')
            .where('p.object = :objectId', { objectId: objectId })
            .andWhere('p.permissionType = :type', { type: PermissionType.ACCEPT_FOR })
            .getOne()
        ) != null
      )
      &&
      (
        (
          await getManager()
            .createQueryBuilder()
            .select('pr')
            .from(permission_requests, 'pr')
            .where('pr.object = :objectId', { objectId: objectId })
            .andWhere('pr.grantee = :grantee', { grantee: (await this.getDID(profile)) })
            .andWhere('pr.status = :status', { status: StatusInfo.ACCEPTED })
            .getOne()
        ) != null
      )

    if (isPermissionAccepted) return true;

    // return true when the file is 'public' or ('accepted_for' and {profile} is in the list).
    // if this function reached here,
    // it means user doesn't have permission to object.
    return false;
  }

  async getPermissionQuery(grantee: string, objectId?: string, owner?: string) {
    var requested =
      await getManager()
        .createQueryBuilder()
        .select('p')
        .from(permissions, 'p');

    if (objectId) {
      requested = requested
        .where('p.object = :objectId', { objectId: objectId });
    }

    if (owner) {
      requested = requested
        .where('p.profile = :owner', { owner: owner });
    }

    var parsed = requested
      .getRawMany();

    var result = [];
    await parsed.then(async (data) => {
      await data.forEach(async (e) => {
        const pr = await getManager()
          .createQueryBuilder()
          .select('pr')
          .where('pr.objectId = :objectId', { objectId: e.object })
          .andWhere('pr.grantee = :grantee', { grantee: grantee })
          .getRawOne();

        const status = pr ? pr.status : null;

        const entity = {
          "interface": "Permissions",
          "owner": e.profile,
          "object_id": e.object,
          "permission_type": e.permissionType,
          "status": status
        };

        result = result.concat(entity);
      });
    });

    return result;
  }

  async getFileList(): Promise<collections[]> {
    const requested =
      await getManager()
        .createQueryBuilder()
        .select('col')
        .from(collections, 'col')
        .getMany();
    /*
    select col
    from collections as col
    */
    return requested;
  }

  async getFileListFromMultipleQuery(query: any): Promise<collections[]> {
    /*
    * Query
    * {
    *   type: string?,
    *   owner: string?,
    *   objectId: number?
    * }
    */
    let requested = await getManager()
      .createQueryBuilder()
      .select('col')
      .from(collections, 'col')
      .where("");

    if (query.type) { requested.andWhere('col.type = :type', { type: query.type }); }
    if (query.owner) { requested.andWhere('col.profile = :owner', { owner: query.owner }); }
    if (query.objectId) { requested.andWhere('col.object = :objectId', { objectId: query.objectId }); }

    return requested.getMany();

  }

  async getSearchedFileList(query: string): Promise<collections[]> {
    const requested =
      await getManager()
        .createQueryBuilder()
        .select('col')
        .from(collections, 'col')
        .where('col.metadata LIKE :query', { query: '%' + query + '%' })
        .getMany();
    /*
    select col
    from collections as col
    where col.metadata LIKE '%{query}%' (== text that has {query})
    */
    return requested;
  }

  async getCommitsFromObjectId(objecId: string): Promise<collections[]> {
    const results: collections[] =
      await getManager()
        .createQueryBuilder()
        .select('col')
        .from(collections, 'col')
        .where("col.object = :objectId", { objectId: objecId })
        .getMany();
    return results;
  }

  async getPermissionRequests(profile: string): Promise<permission_requests[]> {
    // get Permission_requests that object is objectId
    // get objectId using subQuery(profile)
    const requested =
      await getManager()
        .createQueryBuilder()
        .select('pr')
        .from(permission_requests, 'pr')
        .where(async qb => {
          const subQuery = qb.subQuery()
            .select('obj.id')
            .from(objects, 'obj')
            .where('obj.profile = :profile', { profile: profile })
            .andWhere('obj.hub = :hub', { hub: (await this.getDID(profile)) })
            .getQuery();
          return 'pr.object IN ' + subQuery;
        })
        .getMany();

    return requested;
  }

  async postObject(profile: string, hub: string) {
    const createdObject = await getManager()
      .createQueryBuilder()
      .insert()
      .into(objects)
      .returning('*')
      .values({
        profile: profile,
        hub: hub,
      })
      .execute();

    return createdObject.raw[0];
  }

  async postProfile(profile: string, hub: string) {
    const createdProfile = await getManager()
      .createQueryBuilder()
      .insert()
      .into(profiles)
      .returning('*')
      .values({
        profile: profile,
        hub: hub,
      })
      .execute();

    return createdProfile.raw[0];
  }

  async postCollection(commit: Commit, objectId?: number) {
    const protectedMembers = commit.getProtectedMembers();
    const payloadMembers = commit.getPayloadMembers();
    const headerMembers = commit.getHeaderMembers();

    const createdCollection = await getManager()
      .createQueryBuilder()
      .insert()
      .into(collections)
      .returning('*')
      .values({
        object: objectId ? objectId : commit.getProtectedMembers().object_id,
        hub: payloadMembers.odid,
        profile: headerMembers.iss,
        clientKeyId: protectedMembers.kid,
        prevRev: protectedMembers.rev,
        rev: headerMembers.rev,
        note: payloadMembers.developer_message,
        vaultDID: protectedMembers.vaultURL,
        type: protectedMembers.type,
        metadata: payloadMembers.meta
      })
      .execute();

    return createdCollection.raw;
  }
  
  async postPermissionRequest(objectId: string, grantee: string) {
    // get file data from [objects]
    const filedata =
      await getManager()
        .createQueryBuilder()
        .select('obj')
        .from(objects, 'obj')
        .where('obj.object = :objectId', { objectId: objectId })
        .getOne();

    // insert permission_request to [permission_requests]
    const createdRequest = await getManager()
      .createQueryBuilder()
      .insert()
      .into(permission_requests)
      .returning('*')
      .values({
        object: filedata.id,
        profile: filedata.profile,
        hub: filedata.hub,
        grantee: await this.getDID(grantee),
        status: StatusInfo.PENDING
      })
      .execute();

    return createdRequest.raw;
  }

  async patchPermissionRequest(objectId: string, profile: string, decision: string) {
    let status: StatusInfo;
    if (decision.toLocaleLowerCase() == 'accept') status = StatusInfo.ACCEPTED;
    else if (decision.toLocaleLowerCase() == 'reject') status = StatusInfo.REJECTED;

    await getManager()
      .createQueryBuilder()
      .update(permission_requests)
      .set({ status: status })
      .where('object = :objectId', { objectId: objectId })
      .andWhere('hub = :hub', { hub: (await this.getDID(profile)) })
      .andWhere('profile = :profile', { profile: profile })
      .execute();
  }
}