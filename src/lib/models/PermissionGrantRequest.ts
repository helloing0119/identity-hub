import BaseRequest from "./BaseRequest";

export default class PermissionGrantRequest extends BaseRequest {
  readonly owner: string;
  readonly grantee: string;
  readonly objectId: string;
  readonly status: string;

  constructor(json: string | any) {
    super(json);
    this.type = "PermissionGrantRequest";

    let request = json;
    if (typeof json === 'string') {
      request = JSON.parse(json);
    }
    else {
      throw 'Method Error : json should be string';
    }

    if (!('owner' in request)) {
      throw 'Parameter Error : owner is required';
    }

    if (typeof request.owner !== 'string') {
      throw 'Parameter Error : owner should be object';
    }

    this.owner = request.owner;

    if (!('grantee' in request)) {
      throw 'Parameter Error : grantee is required';
    }

    if (typeof request.grantee !== 'string') {
      throw 'Parameter Error : grantee should be object';
    }

    this.grantee = request.grantee;

    if (!('object_id' in request)) {
      throw 'Parameter Error : object_id is required';
    }

    if (typeof request.object_id !== 'string') {
      throw 'Parameter Error : object_id should be object';
    }

    this.objectId = request.object_id;

    if ('status' in request) {
      throw 'Parameter Error : status is required';
    }

    if (typeof request.status !== 'string') {
      throw 'Parameter Error : status should be string';
    }

    this.status = request.status;
  }
}