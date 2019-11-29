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
        <router-link to="/"><v-toolbar-title style="color:white;">Documents Silene - {{routeName()}}</v-toolbar-title></router-link>
        <v-icon style="margin-left:20px;">{{routeIcon()}}</v-icon>
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
      { icon: "all_inbox", text: "Docs Techniques", path: "/tech" },
      { icon: "map", text: "Planothèque", path: "/plans" },
      { icon: "help", text: "Help", path: "/help" }
      /* { icon: 'cloud', text: 'Météo', path: '/meteo' },
      { icon: 'location_city', text: 'BIM', path: '/bim' },
      { icon: 'help', text: 'Aide', path: '/help' }
      { icon: 'library_books', text: 'Docs', path: '/docs' } */
    ],
    urlResidenceId: "",
    currentResidence: null
  }),
  methods: {
    routeName() {
      return this.$route.name
    },
    routeIcon() {
      // console.log(this.$route)
      return this.$route.meta.icon
    }
  },
  created() {
    /* Charge les données de résidence Sharepoint */
    // console.log('chargement des données')
    return this.$store.dispatch("getSharepointResidences").then(() => {
      /* Récupération d'une résidence si param dans l'URL  */
      this.urlResidenceId = this.$route.query.residenceId;
      if (this.urlResidenceId && this.urlResidenceId!==""){
        /* Récupération d'un résidence dans la liste des résidences */
        let residences = this.$store.state.sharepointResidences.fullList
        residences.forEach(element => {
          if (element && element.residenceId == this.urlResidenceId) {
            this.currentResidence = element
          }
        });
        /* Chargement d'une residence. */
        this.$store.dispatch("setCurrentResidence", this.currentResidence);
        /* Chargement des document pour les documents techniques */
        this.$store.dispatch("getSharepointResidenceDocs", this.currentResidence)
        /* Chargement des plans */
        this.$store.dispatch("getSharepointResidencePlans", this.currentResidence)
        /* Chargement des document pour les diags */
        this.$store.dispatch("getResidenceDocs", this.currentResidence.residenceId);
      }
    })
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
