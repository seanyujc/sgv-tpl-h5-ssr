import { dealOccurred } from "@/app/pages";

export function errorPagePreloading(): Promise<any> {
  return import("./error.vue").catch((error) => dealOccurred(error, "Error"));
}
