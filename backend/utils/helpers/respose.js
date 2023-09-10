class Response {
  constructor(status, success, message, errMessage) {
    this.status = status;
    this.errMessage = errMessage;
    this.message = message;
    this.success = success;
  }
}
module.exports = Response;
