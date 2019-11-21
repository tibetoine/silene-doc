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
                <v-list-item-title>{{ item.text }} </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar app color="primary" dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <router-link to="/"><v-toolbar-title style="color:white;">Documents Silene</v-toolbar-title></router-link>
        <v-icon style="margin-left:20px;">menu_book</v-icon>
      </v-app-bar>

      <v-content>
        <router-view/>
      </v-content>      
    </v-app>
  </div>
</template>
<script>
export default {
  data: () => ({
    drawer: null,
    items: [
      { icon: "bug_report", text: "Docs Diagnostics", path: "/diags" },
      { icon: "all_inbox", text: "Docs Techniques", path: "/sharepoint" },
      { icon: "help", text: "Help", path: "/help" }
      /* { icon: 'cloud', text: 'Météo', path: '/meteo' },
      { icon: 'location_city', text: 'BIM', path: '/bim' },
      { icon: 'help', text: 'Aide', path: '/help' }
      { icon: 'library_books', text: 'Docs', path: '/docs' } */
    ]
  }),
  created() {
    /* Charge les données de résidence Sharepoint */
    // console.log('chargement des données')
    this.$store.dispatch("getSharepointResidences");
  }
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
