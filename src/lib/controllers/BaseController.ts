import Context from '../interfaces/Context';
import CommitRequest from '../models/CommitRequest';
import Commit from '../models/Commit';
import BaseRequest from '../models/BaseRequest';
import BaseResponse from '../models/BaseResponse';
import AuthorizationController from './AuthorizationController';

export default abstract class BaseControllelr {
  constructor(protected context: Context, protected authorization: AuthorizationController) { }
  abstract handleRequest(request: BaseRequest, file?: any): Promise<BaseResponse>;

  private static verifyConstraints(request: CommitRequest, file?: File) {
    const headers = request.commits.forEach((commit: Commit, index: number) => {
      if (request.sub !== commit.getProtectedMembers().sub) {
        throw 'Parameter Error : commit.protected.sub';
    }});
  }
}