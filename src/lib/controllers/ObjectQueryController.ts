import Context from "../interfaces/Context";
import ObjectQueryRequest from "../models/ObjectQueryRequest";
import ObjectQueryResponse from "../models/ObjectQueryResponse";
import AuthorizationController from "./AuthorizationController";
import BaseControllelr from "./BaseController";

export default class ObjectQueryController extends BaseControllelr {
  constructor(protected context:Context, authorization:AuthorizationController) {
    super(context, authorization);
  }

  public async handleRequest(request: ObjectQueryRequest): Promise<ObjectQueryResponse> {
    try {
      let fileList = [];
      if(request.allFlag) {
        //if user ask for every file in hub
        fileList = await this.context.store.getFileList();
        const result = new ObjectQueryResponse(fileList);
        return result;
      }
      else {
        if(request.objectId) {
          let objectResults = []
          request.objectId.forEach(async (oid) => {
            const col = await this.context.store.getFileListFromMultipleQuery({
              type: request.getType(),
              owner: request.owner,
              objectId: oid
            });
            objectResults = objectResults.concat(col);
          });
          fileList = objectResults;
        }
        else {
          fileList = await this.context.store.getFileListFromMultipleQuery({
            type: request.getType(),
            owner: request.owner,
            objectId: null
          })
        }
      }

      const response = new ObjectQueryResponse(fileList); 
      return response;
    }
    catch(error) {
      throw error;
    }
  }
}