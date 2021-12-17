import BaseRequest from "./BaseRequest";

export default class PermissionAskRequest extends BaseRequest {
  readonly queryInterface: string;
  readonly owner?: string;
  readonly objectId?: string[];

  constructor(json: string | any) {
    super(json);
    this.type = "PermissionAskRequest";

    let request = json;
    if (typeof json === 'string') {
      request = JSON.parse(json);
    }
    else {
      throw 'Method Error : json should be string';
    }

    if (!('query' in request)) {
      throw 'Parameter Error : query is required';
    }

    if (typeof request.query !== 'object') {
      throw 'Parameter Error : query should be object';
    }

    if (!('interface' in request.query)) {
      throw 'Parameter Error : interface is required';
    }

    this.queryInterface = request.query.interface;

    if ('object_id' in request.query) {
      if (!Array.isArray(request.query.object_id)) {
        throw 'Parameter Error : object_id should be array';
      }

      request.query.object_id.forEach((objectId: any, index: number) => {
        if (typeof objectId !== 'string') {
          throw `Parameter Error : object_id[${index}] should be string`;
        }
      });

      this.objectId = request.query.object_id;
    }

    if ('owner' in request.query) {
      throw 'Parameter Error : owner is required';
    }
    if (typeof request.query.owner !== 'string') {
      throw 'Parameter Error : owner should be string';
    }

    this.owner = request.query.owner;
  }
}