import Context from "../interfaces/Context";
import { collections } from "../interfaces/entity/collections.entity";
import Store from "../interfaces/Store";
import CommitQueryRequest from "../models/CommitQueryRequest";
import CommitQueryResponse from "../models/CommitQueryResponse";
import CommitResponse from "../models/CommitResponse";
import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController";

export default class CommitQueryController extends BaseControllelr {
  constructor(protected context: Context, authorization: AuthorizationController) {
    super(context, authorization);
  }

  public async handleRequest(request: CommitQueryRequest): Promise<CommitQueryResponse> {
    try {
      const objectId = request.objectId;
      const requester = request.iss;
      objectId.forEach(async (oid) => {
        const authed = await this.authorization.hasPermissions(oid, requester);
        if (!authed) throw "User doesn't have permission";
      });
    }
    catch (error) {
      throw error;
    }
    try {
      const objectId = request.objectId;
      let storeResult: collections[] = []
      objectId.forEach(async (oid: string) => {
        const commits: collections[] = await this.context.store.getCommitsFromObjectId(oid);
        if (commits) storeResult = storeResult.concat(commits);
      });

      if (!storeResult) return new CommitQueryResponse([]);

      const commits = storeResult.map(col => {
        return JSON.stringify({
          "protected": {
            "alg": "secp256k1",
            "kid": "",
            "@context": "http://schema.org",
            "interface": "Collections",
            "type": col.type,
            "commited_at": col.createdAt,
            "vaultURL": col.vaultDID,
            "rev": col.rev,
            "object_id": col.object,
            "sub": col.hub,
          },
          "header": {
            "rev": col.rev,
            "iss": col.profile
          },
          "payload": {
            "@context": "http://identity.foundation",
            "@type": col.type,
            "meta": col.metadata,
            "odid": col.vaultDID,
            "developer_message": col.note,
            "data": ""
          }
        });
      });

      const response = new CommitQueryResponse(commits);

      return response;
    }
    catch(error) {
      throw error;
    }
  }
}