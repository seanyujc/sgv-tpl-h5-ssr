import { dealOccurred } from "@/app/pages";

export function homePagePreloading(): Promise<any> {
  return import("./home.vue").catch((error) => dealOccurred(error, "Home"));
}
