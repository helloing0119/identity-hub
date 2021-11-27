import { Controller, Get, Patch, Put } from '@nestjs/common';
import { get } from 'http';
import { AppService } from './app.service';

import { objects } from './entity/objects.entity';
import { profiles } from './entity/profiles.entity';
import { collections } from './entity/collections.entity';
import { permission_requests } from './entity/permission_requests.entity';
import { permissions } from './entity/permissions.entity';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

	@Get()
  async getPermissionStatus(objectId: string, grantee: string): Promise<string> {
    return this.appService.getPermissionStatus(objectId, grantee);
  }

	@Get()
	async getFileList(): Promise<collections[]> {
		return this.appService.getFileList();
	}

	@Get()
	async getSearchedFileList(query: string): Promise<collections[]> {
		return this.appService.getSearchedFileList(query);
	}

	@Patch()
	async putRequestAsk() {
	}
}
