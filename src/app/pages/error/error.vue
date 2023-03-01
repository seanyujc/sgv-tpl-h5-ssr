<template>
  <div
    class="page-error"
    style="
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      font-size: 30px;
      width: 100vw;
    "
  >
    出错了！
  </div>
</template>
<script setup lang="ts">
import { defineComponent, getCurrentInstance } from "vue";
import { useBasePage } from "@/app/pages/base-page";

useBasePage(getCurrentInstance());
// todo
</script>
<style lang="scss" scoped src="./error.scss">
</style>
