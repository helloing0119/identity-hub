import { Injectable, RequestMethod } from '@nestjs/common';

import { Connection, getManager, getRepository } from "typeorm";
import { objects } from './entity/objects.entity';
import { profiles } from './entity/profiles.entity';
import { collections } from './entity/collections.entity';
import { permission_requests, StatusInfo } from './entity/permission_requests.entity';
import { permissions, PermissionType } from './entity/permissions.entity';

@Injectable()
export class DBService {

	async getDID(profile: string): Promise<string> {
		// get hubDID by profile
		const obj = 
			await getManager()
				.createQueryBuilder()
				.select('obj')
				.from(objects, 'obj')
				.where('obj.profile = :profile', { profile: profile})
				.getOne();
		return obj.hub;
	}

	async getHasPermission(objectId: string, profile: string): Promise<boolean> {
    const isPublic =
			(	await getManager()
				.createQueryBuilder()
				.select('p')
				.from(permissions, 'p')
				.where('p.object = :objectId', { objectId: objectId })
				.andWhere('p.permissionType = :type', { type: PermissionType.PUBLIC})
				.getOne()
			) != null;

		const isPermissionAccepted =
			(
				(
					await getManager()
					.createQueryBuilder()
					.select('p')
					.from(permissions, 'p')
					.where('p.object = :objectId', { objectId: objectId })
					.andWhere('p.permissionType = :type', { type: PermissionType.ACCEPT_FOR})
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
		
		// return true when the file is 'public' or ('accepted_for' and {profile} is in the list).
    return isPublic || isPermissionAccepted;
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

	async getSearchedFileList(query: string): Promise<collections[]> {
		const requested =
			await getManager()
				.createQueryBuilder()
				.select('col')
				.from(collections, 'col')
				.where('col.metadata LIKE :query', {query: '%' + query + '%'})
				.getMany();
		/*
		select col
		from collections as col
		where col.metadata LIKE '%{query}%' (== text that has {query})
		*/
		return requested;
	}

	async getPermissionRequests(profile : string) : Promise<permission_requests[]> {
		// get Permission_requests that object is objectId
		// get objectId using subQuery(profile)
		const requested =
			await getManager()
				.createQueryBuilder()
				.select('pr')
				.from(permission_requests, 'pr')
				.where( async qb => {
					const subQuery = qb.subQuery()
						.select('obj.id')
						.from(objects, 'obj')
						.where('obj.profile = :profile', { profile: profile })
						.andWhere('obj.hub = :hub', { hub: (await this.getDID(profile))})
						.getQuery();
					return 'pr.object IN '+ subQuery;
				})
				.getMany();
		/*
		select pr
		from permission_requests as pr
		where pr.object IN (
			select obj.id
			from objects as obj
			where obj.profile = {profile}
			and		obj.hub = {getDID(profile)}
		)
		*/
		return requested;
	}

	async postPermissionRequest(objectId: string, grantee: string) {
		// get file data from [objects]
		const filedata = 
			await getManager()
			.createQueryBuilder()
			.select('obj')
			.from(objects, 'obj')
			.where('obj.object = :objectId', { objectId : objectId })
			.getOne();
		
		// insert permission_request to [permission_requests]
		await getManager()
		.createQueryBuilder()
		.insert()
		.into(permission_requests)
		.values({
			object: filedata.id,
			profile: filedata.profile,
			hub: filedata.hub,
			grantee: await this.getDID(grantee),
			status: StatusInfo.PENDING
		})
		.execute();
		/*
		filedata = 
			select obj
			from objects as obj
			where obj.object = objectId

		insert into permission_requests
		values({
			id, createdAt <= auto
			object = filedata.id
			profile = filedata.profile
			hub = filedata.hub
			grantee = grantee
			status = "pending"
		})
		*/
	}

	async patchPermissionRequest(objectId: string, profile : string, decision: string) {
		let status: StatusInfo;
		if (decision == 'accept') status = StatusInfo.ACCEPTED;
		else if (decision == 'reject') status = StatusInfo.REJECTED;

		await getManager()
		.createQueryBuilder()
		.update(permission_requests)
		.set({status: status})
		.where('object = :objectId', { objectId: objectId })
		.andWhere('hub = :hub', { hub: (await this.getDID(profile)) })
		.andWhere('profile = :profile', { profile: profile })
		.execute();
	}
}