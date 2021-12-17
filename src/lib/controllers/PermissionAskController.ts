import Context from "../interfaces/Context";
import PermissionAskRequest from "../models/PermissionAskRequest";
import PermissionAskResponse from "../models/PermissionAskResponse";
import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController";

export default class PermissionAskController extends BaseControllelr {
  constructor(protected context: Context, authorization:AuthorizationController) {
    super(context, authorization);
  }

  public async handleRequest(request: PermissionAskRequest): Promise<PermissionAskResponse> {
    try {
      const grantee = request.iss;
      const hub = request.sub;

      await this.authorization.registerUser(grantee, hub);
    }

    catch(error) {
      throw error;
    }
    
    try {
      const grantee = request.iss;
      const oids = request.objectId;

      if(!oids) return new PermissionAskResponse([]);

      let result = [];
      oids.forEach(async (oid) => {
        const createdRequest = await this.context.store.postPermissionRequest(oid, grantee);
        result = result.concat(createdRequest);
      });

      const response = new PermissionAskResponse(result);
      return response;
    }
    catch(error) {
      throw error;
    }
  }
}