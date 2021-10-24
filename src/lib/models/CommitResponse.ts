import BaseResponse from "./BaseResponse";
import Commit from "./Commit";

export default class CommitResponse extends BaseResponse {
  readonly rev: string[];

  constructor(commits: Commit[], developerMessage?: string) {
    super('CommitResponse', developerMessage);

    this.rev = [];
    commits.forEach((c: Commit) => {
      this.rev.push(c.getHeaderMembers().rev);
    });

    this.responseJson = Object.assign({}, {
      context: BaseResponse.context,
      type: this.type,
      developerMessage: this.developerMessage,
      rev: this.rev
    });

    this.responseString = JSON.stringify(this.responseJson);
  }
}