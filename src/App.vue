<template>
  <div id="app">
    <v-app id="inspire">
      <v-navigation-drawer v-model="drawer" app>
        <v-list dense>
          <template v-for="item in items">
            <v-list-item href :to="item.path" :key="item.text">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ item.text }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="indigo" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Documents Silene</v-toolbar-title>
        <v-icon style="margin-left:20px;">menu_book</v-icon>
      </v-app-bar>

      <v-content>
        <router-view/>
      </v-content>
      <v-footer color="indigo" app>
        <span class="white--text">&copy; 2019</span>
      </v-footer>
    </v-app>
  </div>
</template>
<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { icon: "bug_report", text: "Diagnostics", path: "/diags" },
      { icon: "help", text: "Help", path: "/help" }
      /* { icon: 'cloud', text: 'Météo', path: '/meteo' },
      { icon: 'location_city', text: 'BIM', path: '/bim' },
      { icon: 'help', text: 'Aide', path: '/help' }
      { icon: 'library_books', text: 'Docs', path: '/docs' } */
    ]
  })
};
</script>
<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
