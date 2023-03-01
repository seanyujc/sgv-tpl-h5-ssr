<template>
  <f7App v-bind="f7params">
    <Suspense>
      <router-view></router-view>
      <template #fallback> Loading... </template>
    </Suspense>
  </f7App>
</template>
<script setup lang="ts">
import { reactive } from "@vue/reactivity";
import { f7App } from "framework7-vue/bundle";

const f7params = reactive({
  name: "",
  id: "link.trial.m",
  theme: "ios",
});
</script>
<style lang="scss" scoped></style>
