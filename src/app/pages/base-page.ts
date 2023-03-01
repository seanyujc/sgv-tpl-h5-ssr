import { inject, onMounted, onBeforeUnmount, onUnmounted } from "vue";
import type { Ref, ComponentInternalInstance } from "vue";
import { onBeforeRouteLeave } from "vue-router";

export function useBasePage(target: ComponentInternalInstance | null) {
  onMounted(() => {
    // todo
  }, target);

  onBeforeRouteLeave((to, from) => {});

  onBeforeUnmount(() => {}, target);

  return {};
}
