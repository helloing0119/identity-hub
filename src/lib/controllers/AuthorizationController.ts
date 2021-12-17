
import BaseRequest from '../models/BaseRequest';
import WriteRequest from '../models/CommitRequest';
import CommitQueryRequest from '../models/CommitQueryRequest';
import ObjectQueryRequest from '../models/ObjectQueryRequest';
import ObjectQueryResponse from '../models/ObjectQueryResponse';
import Commit from '../models/Commit';
import Context from '../interfaces/Context';

export enum AuthorizationOperation {
  Create = 'create',
  Read = 'read',
  Update = 'update',
  Delete = 'delete',
}

export default class AuthorizationController {
  constructor (private context: Context) {
  }

  async hasRegistered(profile: string): Promise<Boolean> {
    const registered = await this.context.store.isRegistered(profile);
    return registered;
  }

  async registerUser(profile: string, hub: string): Promise<Number> {
    const registered = await this.context.store.isRegistered(profile);
    if(!registered) {
      const createdProfile = await this.context.store.postProfile(profile, hub);
      return createdProfile;
    }

    return 0;
  }

  async hasPermissions(objectId: string, profile: string): Promise<Boolean> {
    return this.context.store.getHasPermission(objectId, profile);
  }
}