import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController";
import Context from "../interfaces/Context";
import CommitRequest from "../models/CommitRequest";
import CommitResponse from "../models/CommitResponse";

export default class CommitContoller extends BaseControllelr {
  constructor(protected context: Context, protected authorization: AuthorizationController) {
    super(context, authorization);
  }

  async handleRequest(request: CommitRequest, file: File): Promise<CommitResponse> {
    try {
      request.commits.forEach(async (commit) => {
        const oid = commit.getProtectedMembers().object_id;
        if (oid) {
          const authed = await this.context.store.getHasPermission(oid, request.iss);
          if (!authed) throw "User doesn't have permission";
        }
      })
    }
    catch (error) {
      throw error;
    }
    try {
      request.commits.forEach(async (commit) => {
        await commit.validate(this.context);
      });

      if(request.commits[0]) {
        //register user if not registered yet
        const profile = request.commits[0].getHeaderMembers().iss;
        const hub = request.commits[0].getProtectedMembers().sub;
        await this.authorization.registerUser(profile, hub);
      }

      request.commits.forEach(async (commit) => {
        const oid = commit.getProtectedMembers().object_id;

        if (oid) {
          //Case : push new commit to existing object
          await this.context.store.postCollection(commit);
        }
        else {
          //Case : push new object
          const profile = commit.getHeaderMembers().iss;
          const hub = commit.getProtectedMembers().sub;
          const createdObjectId = await this.context.store.postObject(profile, hub);
          await this.context.store.postCollection(commit, createdObjectId);
        }
      });

      const response = new CommitResponse(request.commits);

      return response;
    }
    catch(error) {
      throw error;
    }
  }
}