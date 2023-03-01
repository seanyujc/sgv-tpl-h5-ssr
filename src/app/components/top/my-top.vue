<template>
  <div class="component-top">
    top
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
  name: "Top",
  setup(props) {
    const state = reactive({});
    return { state };
  },
});
</script>
<style lang="scss" scoped src="./my-top.scss">
</style>