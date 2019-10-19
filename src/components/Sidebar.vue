<template>
  <header>
    <div id="home">WebGL sandbox</div>
    <nav>
      <ul>
        <li v-for="(list, index) in navMenuLists" :key="index">
          <nuxt-link :to="list.path">{{list.title}}</nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  props: {
    navMenuLists: Array
  }
});
</script>
<style lang="scss" scoped>
header {
  flex-basis: 300px;
  border-right: 1px solid #dbdfe1;
  padding: 20px;
  #home {
    font-size: 2.5rem;
    font-weight: bold;
  }
  nav {
    margin-top: 20px;
    ul li {
      font-size: 1.6rem;
      margin-bottom: 10px;
      a {
        position: relative;
        padding-bottom: 5px;
        font-weight: 300;
        &::after {
          content: "";
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background-color: #000;
          transform: scale3d(0, 1, 1);
          transform-origin: 0;
          transition: transform 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
        }
      }
      a:hover {
        &::after {
          transform: scale3d(1, 1, 1);
        }
      }
    }
  }
}
</style>
