<template>
  <div class="wrapper">
    <sidebar :nav-menu-lists="data.navMenuLists" />
    <main>
      <nuxt-child />
    </main>
  </div>
</template>
<script>
import Sidebar from "@/components/Sidebar";
export default {
  components: { Sidebar },
  computed: {
    data() {
      return {
        navMenuLists: [
          { path: "/works/webgl-sandbox", title: "My first WebGL" },
          {
            path: "/works/webgl-sandbox/texture-image",
            title: "My first Texture Image"
          },
          {
            path: "/works/webgl-sandbox/multi-texture-image",
            title: "Multi Texture Image"
          }
        ]
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 100vh;

  main {
    position: relative;
    flex-grow: 1;
  }
}
</style>
