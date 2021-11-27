import { Injectable } from '@nestjs/common';

import { Connection, getManager } from "typeorm";
import { objects } from './entity/objects.entity';
import { profiles } from './entity/profiles.entity';
import { collections } from './entity/collections.entity';
import { permission_requests } from './entity/permission_requests.entity';
import { permissions } from './entity/permissions.entity';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getPermissionStatus(objectId: string, grantee: string): Promise<string> {
    const requestedPermission =
      await getManager()
        .createQueryBuilder()
				.select('pr.status')
        .from(permission_requests, 'pr')
				.where('pr.objectId = :objectId', {objectId: objectId})
        .andWhere('pr.grantee = :grantee', { grantee: grantee })
        .getOneOrFail();
		/*
		select pr.status
		from permission_requests as pr
		where pr.grantee = grantee
		*/
    return requestedPermission.status;
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
				.where('col.metadata LIKE :query', {query : '%' + query + '%'})
				.getMany();
		/*
		select col
		from collections as col
		where col.metadata LIKE '%{query}%' (== text that has {query})
		*/
		return requested;
	}
}
