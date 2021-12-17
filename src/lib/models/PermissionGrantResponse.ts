import BaseResponse from "./BaseResponse";

export default class PermissionGrantResponse extends BaseResponse {

  readonly owner: string;
  readonly grantee: string;
  readonly objectId: string;
  readonly status: string;

  constructor(owner: string, grantee: string, objectId: string, status: string) {
    super('PermissionGrantResponse');

    this.owner = owner;
    this.grantee = grantee;
    this.objectId = objectId;
    this.status = status;

    this.responseJson = Object.assign({}, {
      context: BaseResponse.context,
      type: this.type,
      developerMessage: this.developerMessage,
      owner: this.owner,
      grantee: this.grantee,
      object_id: this.objectId,
      status: this.status
    });

    this.responseString = JSON.stringify(this.responseJson);
  }
}