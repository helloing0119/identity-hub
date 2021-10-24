import BaseResponse from "./BaseResponse";

export default class CommitQueryResponse extends BaseResponse {

  readonly commits: any[];

  constructor(commits: any[], developerMessage?: string) {
    super('CommitQueryResponse', developerMessage);

    this.commits = [];
    //todo : validate commit
    this.commits = commits;

    this.responseJson = Object.assign({}, {
      context: BaseResponse.context,
      type: this.type,
      developerMessage: this.developerMessage,
      commits: this.commits
    });

    this.responseString = JSON.stringify(this.responseJson);
  }
}