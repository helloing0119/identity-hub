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

  async getPermission(grantee: string): Promise<string> {
    const requestedPermission =
      await getManager()
        .createQueryBuilder()
        .select('status')
        .from(permission_requests, "pr")
        .where("pr.grantee = :_grantee", { _grantee: grantee })
        .getOne();
    return requestedPermission.status;
  }
}
