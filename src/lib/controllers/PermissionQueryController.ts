import Context from "../interfaces/Context";
import PermissionQueryRequest from "../models/PermissionQueryRequest";
import PermissionQueryResponse from "../models/PermissionQueryResponse";
import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController"

export default class PermissionQueryController extends BaseControllelr {
  constructor(context: Context, authorization: AuthorizationController) {
    super(context, authorization);
  }

  async handleRequest(request: PermissionQueryRequest): Promise<PermissionQueryResponse> {
    try {
      const grantee = request.iss;
      const objectId = request.objectId;
      const owner = request.owner;

      var result = []
      if(objectId) {
        objectId.forEach(async (oid) => {
          const entity = await this.context.store.getPermissionQuery(grantee, oid, owner);
          result = result.concat(entity);
        });
      }
      else {
        result = await this.context.store.getPermissionQuery(grantee, null, owner);
      }

      const response = new PermissionQueryResponse(result);
      return response;
    }
    catch(error) {
      throw error;
    }
  }
}