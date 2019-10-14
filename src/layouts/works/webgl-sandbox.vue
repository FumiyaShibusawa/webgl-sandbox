<template>
  <div class="wrapper">
    <header>
      <div id="home">WebGL sandbox</div>
      <nav>
        <ul>
          <li>
            <nuxt-link to>My first WebGL</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/works/webgl-sandbox/texture-image">My first Texture Image</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/works/webgl-sandbox/multi-texture-image">Multi Texture Image</nuxt-link>
          </li>
          <li>
            <nuxt-link to="/works/webgl-sandbox/points-on-click">Points On Click</nuxt-link>
          </li>
        </ul>
      </nav>
    </header>
    <main>
      <nuxt />
    </main>
  </div>
</template>
<style lang="scss" scoped>
.wrapper {
  display: flex;
  height: 100vh;
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
          transition: font-weight 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
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
          font-weight: 400;
          &::after {
            transform: scale3d(1, 1, 1);
          }
        }
      }
    }
  }
  main {
    position: relative;
    flex-grow: 1;
  }
}
</style>
