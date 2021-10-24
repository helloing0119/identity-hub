export default abstract class BaseRequest {
  /**
   * Generic hub request class.
   * All request classes is implemented extending this class.
   */

  /**
  *  @context : schema
  */
  public static readonly context = "";
  /**
   * @type : type of request
   * type should be initialized by class entexding this class
   */
  protected type: string;

  /**
   * did information of
   * iss : issuer = requester
   * aud : audience = responser, central hub
   * sub : subject = generally, storage hub
   * aud = sub for this project
   */
  readonly iss: string;
  readonly aud: string;
  readonly sub: string;

  constructor(json: string | any) {
    let request = json;
    if (typeof json === 'string') {
      request = JSON.parse(json);
    }
    else {
      throw 'Method Error : json should be string';
    }

    if (BaseRequest.context !== request['@context']) {
      throw 'Parameter Error : @context does not match';
    }

    ['@type', 'iss', 'aud', 'sub'].forEach((property) => {
      if (!(property in request)) {
        throw `Parameter Error : ${property} is required`;
      }
    })

    this.type = request['@type'];
    this.iss = request.iss;
    this.aud = request.aud;
    this.sub = request.sub;
  }

  /**
   * Gets the type of request
   * Other members can be access directly
   * since they are public members.
   * @returns this.type
   */
  getType(): string {
    return this.type;
  }
}