export class RespDataShellInfo<T = any> {
  errorCode = 0;
  errorMessage = "";
  data?: T;
  status = 0;
  subCode = 0;
  subMessage = "";
}
