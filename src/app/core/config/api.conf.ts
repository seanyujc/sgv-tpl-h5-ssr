import type { ApiConfigInfo } from "sg-resource/dist/es/lib/domain/ApiConfigInfo";

export const apiConfig: ApiConfigInfo<"default", ""> = {
  post: {
    login: {
      path: "/admin/login",
      host: "default"
    }
  }
};
