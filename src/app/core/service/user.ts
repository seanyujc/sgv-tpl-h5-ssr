import type { UserInfo } from "../domain/UserInfo";
import { post } from "../resource";

function checkToken() {
  return post("checkToken");
  // return Promise.resolve(true);
}
function login(userName: string, password: string): Promise<UserInfo> {
  return post("login", { userName, password });
}

export const userService = { checkToken, login };
