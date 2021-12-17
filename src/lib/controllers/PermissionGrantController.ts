import Context from "../interfaces/Context";
import PermissionGrantRequest from "../models/PermissionGrantRequest";
import PermissionGrantResponse from "../models/PermissionGrantResponse";
import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController";

export default class PermissionGrantController extends BaseControllelr {
  constructor(context: Context, authorization: AuthorizationController) {
    super(context, authorization);
  }

  async handleRequest(request: PermissionGrantRequest): Promise<PermissionGrantResponse> {
    try {
      const oid = request.objectId;
      const profile = request.iss;
      const authed = this.authorization.hasPermissions(oid, profile);
      if(!authed) throw "User doesn't have permission";
    }
    catch(error) {
      throw error;
    }

    try {
      const owner = request.iss;
      const grantee = request.grantee;
      const objectId = request.objectId;
      const status = request.status;
      await this.context.store.patchPermissionRequest(objectId,grantee,status);
      const response = new PermissionGrantResponse(owner, grantee, objectId, status);
      return response;
    }
    catch(error) {
      throw error;
    }
  }
}