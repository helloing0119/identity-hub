import BaseRequest from "./BaseRequest";
import Commit from "./Commit";
import Context from "../interfaces/Context";

export default class CommitRequest extends BaseRequest {
  commits: Commit[];

  constructor(json: string | any) {
    super(json);
    this.type = "CommitRequest";
    let request = json;

    if (typeof json === 'string') {
      request = JSON.parse(json);
    }
    else {
      throw 'Method Error : json should be string';
    }

    this.commits = [];
    request.commit.foreach((jwt: any, index: number) => {
      try {
        this.commits.push(new Commit(jwt));
      } catch (e) {
        throw `Method Error : failed to read Commit[${index}](${e})`;
      }
    });
  }

  async validateAllCommits(context: Context) {
    this.commits.forEach((c: Commit) => {
      c.validate(context);
    });
  }
}