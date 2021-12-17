export default abstract class BaseResponse {
  /**
  *  @context : schema
  */
  public static readonly context = "";

  /**
   * @type : type of request
   * @developerMessage: serverside message
   */
  protected type: string;
  protected developerMessage: string;

  /**
   * stringfied / rough json.
   * should be initialized by the class extending this class.
   */
  protected responseString: string;
  protected responseJson: object;

  constructor(type: string, developerMessage?: string) {
    this.type = type;
    if(developerMessage) {
      this.developerMessage = developerMessage;
    } else {
      this.developerMessage = "No developer message";
    }
  }

  getString(): string {
    return this.responseString;
  }

  getJson(): object {
    return this.responseJson;
  }
}