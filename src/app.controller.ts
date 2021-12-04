import { Controller, Get, Patch, Post } from '@nestjs/common';
import { AppService } from './app.service';

import { collections } from './entity/collections.entity';
import { permission_requests } from './entity/permission_requests.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

	// whether {profile} has an permission to access / download {objectId}.
	@Get() 
  async getHasPermission(objectId: string, profile: string): Promise<boolean> {
    return this.appService.getHasPermission(objectId, profile);
  }

	// all data in [collections].
	@Get() 
	async getFileList(): Promise<collections[]> {
		return this.appService.getFileList();
	}

	// items in [collection], which has {query} string in metadata.
	@Get()
	async getSearchedFileList(query: string): Promise<collections[]> {
		return this.appService.getSearchedFileList(query);
	}

	// get every permission requests to files which { profile } has.
	@Get() 
	async getPermissionRequests(profile : string): Promise<permission_requests[]> {
		return this.appService.getPermissionRequests(profile);
	}

	// request permission for file(objectId) by name of grantee(profile).
	@Post() 
	postPermissionRequest(objectId: string, grantee: string): void {
		this.appService.postPermissionRequest(objectId, grantee);
	}

	// change permission_request status of file(objectId) by name of owner(profile)
	@Patch()
	patchPermissionRequest(objectId: string, owner : string, decision: string): void {
		this.appService.patchPermissionRequest(objectId, owner, decision);
	}
}
