import BaseResponse from "./BaseResponse";

export default class ObjectQueryResponse extends BaseResponse {

  readonly objects: any[];

  constructor(objects: any[], developerMessage?: string) {
    super('ObjectQueryResponse', developerMessage);

    objects.forEach((o: any, index: number) => {
      if (!('interface' in o)) {
        throw `Parameter Error : objects[${index}] - interface is required`;
      }
      if (!('context' in o)) {
        throw `Parameter Error : objects[${index}] - context is required`;
      }
      if (!('type' in o)) {
        throw `Parameter Error : objects[${index}] - type is required`;
      }
      if (!('meta' in o)) {
        throw `Parameter Error : objects[${index}] - meta is required`;
      }
      if (!('id' in o)) {
        throw `Parameter Error : objects[${index}] - id is required`;
      }
      if (!('created_by' in o)) {
        throw `Parameter Error : objects[${index}] - created_by is required`;
      }
      if (!('created_at' in o)) {
        throw `Parameter Error : objects[${index}] - created_at is required`;
      }
      if (!('sub' in o)) {
        throw `Parameter Error : objects[${index}] - sub is required`;
      }
      if (!('revisions' in o)) {
        throw `Parameter Error : objects[${index}] - revisions is required`;
      }
    });
    this.objects = objects;

    this.responseJson = Object.assign({}, {
      context: BaseResponse.context,
      type: this.type,
      developerMessage: this.developerMessage,
      objects: this.objects
    });

    this.responseString = JSON.stringify(this.responseJson);
  }
}