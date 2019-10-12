<template>
  <nuxt-child></nuxt-child>
</template>
<script lang="ts" scoped>
import Vue from "vue";
import { Context } from "@nuxt/types";
export default Vue.extend({
  layout: "works/webgl-sandbox"
});
</script>
