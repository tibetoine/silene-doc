<template>
  <v-container>
    <v-overlay
      opacity="0.46"
      :value="overlay"
      z-index="200"
    >
      <v-container style="height: 400px;">
        <v-row
          class="fill-height"
          align-content="center"
          justify="center"
        >
          <v-col
            class="title text-center"
            cols="12"
          >
            {{loadingText}}
          </v-col>
          <v-col cols="6">
            <v-progress-linear
              color="deep-purple accent-4"
              indeterminate
              rounded
              height="6"
            ></v-progress-linear>
          </v-col>
        </v-row>
      </v-container>
    </v-overlay>

    <v-overlay
      opacity="0.46"
      :value="alertOverlay"
      z-index="200"
      @click="alertOverlay=false"
    >
      <v-alert
        prominent
        type="warning"
        dark
        border="left"
        transition="scale-transition"
      >
        <v-row align="center">
        <v-col class="grow">{{errorText}}</v-col>
        <v-col class="shrink">
          <v-btn color="grey darken-2" @click="alertOverlay=false">Fermer</v-btn>
        </v-col>
      </v-row>
      </v-alert>
    </v-overlay>
    <v-autocomplete
      label="Résidences"
      :items="residences"
      v-model="selected"
      color="blue lighten-1"
      item-value="residence"
      prepend-icon="mdi-city"
      return-object
      solo
      :filter="filterResidence"
    >
      <template v-slot:selection="data">
        <v-chip
          :input-value="data.selected"
          color="blue lighten-1"
          class="white--text"
          v-on="data.on"
        >
          <v-icon left>mdi-office-building</v-icon>
          <span>{{data.item.residenceId}} - {{data.item.residenceName}}</span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          :color="item.disabled ? 'blue lighten-5':'blue lighten-1'"
          class="headline font-weight-light white--text"
        >{{ item.residenceName.charAt(0) }}</v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.residenceId"></v-list-item-title>
          <v-list-item-subtitle v-text="item.residenceName"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon :disabled="item.disabled">mdi-archive</v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>
    <v-text-field
      v-if="(sharepointDocs.length > 0 || filter !== '')"
      v-model="filter"
      label="Filtrer ici "
      outlined
    ></v-text-field>

    <template>
      <v-layout column class="silene-fab-container">
        <v-btn
          v-if="downloadButtonVisible"
          dark
          fab
          color="red"
          class="silene-fab-button"
          @click="downloadAll"
        >
          <v-icon>mdi-download</v-icon>
        </v-btn>

        <v-btn
          dark
          fab
          color="blue"
          @click="dialog = true"
          class="silene-fab-button"
        >
          <v-icon>info</v-icon>
        </v-btn>
      </v-layout>
    </template>

    <v-list v-if="sharepointDocs.length > 0" two-line>
      <template v-for="(item) in sharepointDocs">
        <v-list-item :key="item.title">
          <v-list-item-avatar>
            <v-icon
              v-bind:class="getTypeItemsClass(item.typeLabel)"
            >{{getTypeItemsIcon(item.typeLabel)}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.documentName"></v-list-item-title>
            <v-list-item-subtitle v-html="item.typeLabel"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action >
            <v-checkbox
              v-model="item.active"
              color="primary"
              @change="isDownloadButtonVisible"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-action >
            <v-btn icon target="_blank" @click="downloadFile(item)">
              <v-icon color="grey">get_app</v-icon>
            </v-btn>
          </v-list-item-action>



        </v-list-item>
      </template>
    </v-list>
    <v-alert v-else type="info">
      Aucune donnée avec ces critères.
      (Avez-vous choisi une résidence ?)
    </v-alert>
    <v-dialog v-model="dialog" width="500">
      <v-card>
        <v-app-bar>
          <v-toolbar-title>Légende</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="dialog = false">
            <v-icon>close</v-icon>
          </v-btn>
        </v-app-bar>

        <v-list two-line>
          <template v-for="(item, propertyName, index) in items">
            <v-list-item :key="index">
              <v-list-item-avatar>
                <v-icon v-bind:class="item.class">{{item.icon}}</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-html="propertyName"></v-list-item-title>
                <v-list-item-subtitle v-html="item.description"></v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </template>
        </v-list>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="primary" text @click="dialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
import { removeAccent, filterResidence } from "../shared/helper";
import JSZip from 'jszip'
export default {
  name: "sharepoint",
  data: () => ({
    selected: null,
    dialog: false,
    errorText : "Oups! Il y a eu une erreur",
    loadingText : "Chargement des données",
    filter: "",
    overlay: false,
    alertOverlay: false,
    downloadButtonVisible: false,
    items: {
      Devis: {
        description: "Bordereau de Suivi de déchets Amiante",
        icon: "assignment",
        class: "orange black--text"
      },
      CCTP: {
        description: "Rapport d'Inspection des Canalisations",
        icon: "menu_book",
        class: "blue white--text"
      },
      Annexe: {
        description: "Rapport d'Inspection des Canalisations",
        icon: "menu_book",
        class: "green lighten-1 white--text"
      }
    }
  }),
  watch: {
    selected(newValue) {
      if (!newValue) {
        return
      }

      try {
        this.$store.dispatch("setCurrentResidence", newValue);
        this.loadingText = "Recherche des plans sur Sharepoint"
        this.overlay = true
        // console.log('overlay = true ? ', this.overlay)
        this.$store.dispatch("getSharepointResidenceDocs", newValue).then((documents)=> {
            if (!documents || documents.length == 0) {
              // console.log(this.currentResidence)
              this.errorText = "Aucun documents trouvés pour cette résidence : " + this.currentResidence.residenceId + " - " + this.currentResidence.residenceName
              this.alertOverlay = true
            }
            // console.log('this.overlay = false : ', this.overlay)
            setTimeout(()=> {this.overlay = false}, 400);
          }
        )
      } catch (e) {
        console.error(e)
        this.overlay = false
      }
    },
    currentResidence(newValue) {
      if (newValue) {
        this.selected = newValue;
      }
    }
  },
  methods: {
    clearFilter () {
      this.filter = ""
    },
    removeResidence () {
      this.selected = null
    },
    isDownloadButtonVisible() {
      console.log('mm')
      console.log(this.sharepointDocs.filter(item=>item.active).length)
      this.downloadButtonVisible = this.sharepointDocs.filter(item=>item.active).length > 0
    },
    async downloadAll() {
      try {
        this.loadingText = "Téléchargement de vos plans"
        // console.log('overlay : ', this.overlay)
        this.overlay = true
        // console.log('overlay : ', this.overlay)

        /* TODO - Indicateur de chargement */

        const mysuccess = (data) => {
          this.forceBlobDownload(data, "test.zip")
          this.overlay = false
        }

        let documentsATelecharger = this.sharepointDocs.filter(item=>item.active);
        var zip = new JSZip();

        console.log(documentsATelecharger)

        const dispatchAsyncEvent = async (fileToDownload) => {
          console.log('Début traitement du fichier %s ', fileToDownload.sharepointServerRelativeUrl)
          return this.$store
              .dispatch("getSharepointDoc", fileToDownload.sharepointServerRelativeUrl)
        }

        const processAFile = async (fileToDownload) => {

          return dispatchAsyncEvent(fileToDownload).then((downloadedFile) => {

            var parts = fileToDownload.sharepointServerRelativeUrl.split("/");
            var fileName = parts[parts.length - 1];
            zip.file(fileName, new Blob([downloadedFile.data]));
            console.log('Traitement du fichier %s terminé', fileName)
          }).catch ((e) => console.error('Erreur lors du téléchargement / insertion dans zip',e))
        }

        const processFilesToDownload = async (filesToDownload) => {
          return Promise.all(filesToDownload.map(file => processAFile(file)))
        }

        processFilesToDownload(documentsATelecharger).then(()=> {
          zip.generateAsync({type:"blob"}).then(function(content) {
            mysuccess(content)
          }).catch( (e)=> console.error('erreur Generating zip file',e));
        })
      }
      catch (e) {
        console.error(e)
        this.overlay = false

      }
    },
    downloadFile(item) {
      this.$store
        .dispatch("getSharepointDoc", item.sharepointServerRelativeUrl)
        .then((downloadedFile) => {
          /* Récupère le nom du fichier */
          var parts = item.sharepointServerRelativeUrl.split("/");
          var fileName = parts[parts.length - 1];

          this.forceFileDownload(downloadedFile, fileName);
        }).catch ((e) => console.error(e))
    },
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    forceBlobDownload(content, fileName) {
      const url = window.URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName); //or any other extension
      document.body.appendChild(link);
      link.click();
    },
    getTypeItemsClass: function(typeLabel) {
      let defaultClass = "blue white--text";
      // console.log('Récupération de classe pour : ', typeLabel, this.items[typeLabel])

      if (this.items[typeLabel]) {
        // console.log('Objet : ', this.items[typeLabel].class)
        return this.items[typeLabel].class;
      } else {
        return defaultClass;
      }
    },
    getTypeItemsIcon: function(typeLabel) {
      let defaultIcon = "bug_report";
      if (this.items[typeLabel]) {
        return this.items[typeLabel].icon;
      } else {
        return defaultIcon;
      }
    },
    filterResidence: function(item, queryText) {
      return filterResidence(item, queryText);
    }
  },
  computed: {
    ...mapState({
      currentResidence: state => {
        return state.currentResidence;
      }
    }),
    residences() {
      var filteredResidences = this.$store.state.sharepointResidences.fullList;
      return filteredResidences.map(item => {
        /*let disabled = !item.libraries || item.libraries.length <= 0;
        item.disabled = disabled;*/
        return item;
      });
    },
    sharepointDocs() {
      if (!this.$store.state.sharepointDocs.fullList || this.$store.state.sharepointDocs.fullList == null || this.$store.state.sharepointDocs.fullList.length == 0) {
        return []
      }
      let returnList = this.$store.state.sharepointDocs.fullList.filter(item => {
        /* On passe filtered a true quand on veut voir l'item */
        let filtered = false;
        /* Si mon filtre est null, je ne filtre pas. */
        if (!this.filter) {
          return true
        }
        if (
          removeAccent(item.typeLabel.toLowerCase()).indexOf(
            removeAccent(this.filter.toLowerCase())
          ) > -1
        ) {
          filtered = true;
        }
        if (
          removeAccent(item.documentName.toLowerCase()).indexOf(
            removeAccent(this.filter.toLowerCase())
          ) > -1
        ) {
          filtered = true;
        }

        return filtered;
      });

      /* Je crée un nouvel objet à partir de la liste initiale pour être sûr que les propriétés de cet objet soient réactives. (Voir :https://fr.vuejs.org/v2/guide/reactivity.html ) */
      returnList = Object.assign([], returnList.map(item => {
        item.active = false
        return item
      }))

      return returnList
    }
  }
};
</script>

<style scoped>
  .silene-fab-container {
    z-index:100;
    position: fixed;
    bottom: 0;
    right: 0;
    padding:10px;
  }
  .silene-fab-button {
    margin-bottom:10px;
  }

</style>