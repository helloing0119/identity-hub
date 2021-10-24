import BaseResponse from "./BaseResponse";

export default class PermissionAskResponse extends BaseResponse {

  readonly permissions: any[];

  constructor(permissions: any[]) {
    super('PermissionAskResponse');

    permissions.forEach((o: any, index: number) => {
      if (!('interface' in o)) {
        throw `Parameter Error : permissions[${index}] - interface is required`;
      }
      if (!('owner' in o)) {
        throw `Parameter Error : permissions[${index}] - owner is required`;
      }
      if (!('object_id' in o)) {
        throw `Parameter Error : permissions[${index}] - object_id is required`;
      }
      if (!('permission_type' in o)) {
        throw `Parameter Error : permissions[${index}] - permission_type is required`;
      }
    });
    this.permissions = permissions;

    this.responseJson = Object.assign({}, {
      context: BaseResponse.context,
      type: this.type,
      developerMessage: this.developerMessage,
      permissions: this.permissions
    });

    this.responseString = JSON.stringify(this.responseJson);
  }
}