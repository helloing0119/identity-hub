import { Injectable } from '@nestjs/common';

import { DBService } from './db.service';
import { collections } from './entity/collections.entity';
import { permission_requests, StatusInfo } from './entity/permission_requests.entity';

@Injectable()
export class AppService {
	constructor(private readonly dbService: DBService) { }

	async getHasPermission(objectId: string, profile: string): Promise<boolean> {
    return this.dbService.getHasPermission(objectId, profile);
  }

	async getFileList(): Promise<collections[]> {
		return this.dbService.getFileList();
	}

	async getSearchedFileList(query: string): Promise<collections[]> {
		return this.dbService.getSearchedFileList(query);
	}

	async getPermissionRequests(profile : string): Promise<permission_requests[]> {
		return this.dbService.getPermissionRequests(profile);
	}

	postPermissionRequest(objectId: string, grantee: string): void {
		this.dbService.postPermissionRequest(objectId, grantee);
	}

	patchPermissionRequest(objectId: string, profile : string, decision: string): void {
		this.dbService.patchPermissionRequest(objectId, profile, decision);
	}
}
