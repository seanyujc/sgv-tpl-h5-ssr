<template>
  <f7Page class="page-home">
    WelCome!
    <MyTop></MyTop>
  </f7Page>
</template>
<script setup lang="ts">
import { useBasePage } from "@/app/pages/base-page";
import { setTitle, setKeywords } from "@/app/core/store";
import { getCurrentInstance } from "vue";


setTitle("首页");

useBasePage(getCurrentInstance());
// todo
</script>
<style lang="scss" scoped src="./home.scss"></style>
