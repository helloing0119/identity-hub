import BaseRequest from "./BaseRequest";

export default class ObjectQueryRequest extends BaseRequest {
  readonly queryInterface: string;
  readonly queryContext: string;
  readonly fileType?: string;
  readonly owner?: string;
  readonly objectId?: string[];
  readonly allFlag: boolean;

  constructor(json: string | any) {
    super(json);
    this.type = "ObjectQueryRequest";

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

    if (!('context' in request.query)) {
      throw 'Parameter Error : context is required';
    }

    this.queryInterface = request.query.interface;
    this.queryContext = request.query.context;

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
      if (typeof request.query.owner !== 'string') {
        throw 'Parameter Error : owner should be string';
      }
      this.owner = request.query.owner;
    }

    if ('type' in request.query) {
      if (typeof request.query.type !== 'string') {
        throw 'Parameter Error : file type should be string';
      }
      this.fileType = request.query.owner;
    }

    if (this.owner || this.objectId || this.fileType) {
      this.allFlag = false;
    } else {
      this.allFlag = true;
    }
  }
}