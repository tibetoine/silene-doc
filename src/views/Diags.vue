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
          close
          @click:close="removeResidence()"
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

    <v-text-field v-if="(diagDocs.length > 0 || filter !== '')"
      v-model="filter"
      prepend-icon="filter_list"
      filled
      clear-icon="mdi-close-circle"
      clearable
      label="C'est par ici pour filtrer ... (Par exemple 'DAPP' ou un numéro de lot de cette résidence)"
      type="text"
      @click:clear="clearFilter"
    ></v-text-field>
    <v-list v-if="diagDocs.length > 0" two-line>
      <template v-for="(item) in diagDocs">
        <v-list-item :key="item.title">
          <v-list-item-avatar>
            <v-icon v-bind:class="getTypeItemsClass(item.type)">{{getTypeItemsIcon(item.type)}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.fileName"></v-list-item-title>
            <v-list-item-subtitle v-html="item.type"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action >
            <v-checkbox
              v-model="item.active"
              color="primary"
              @change="isDownloadButtonVisible"
            ></v-checkbox>
          </v-list-item-action>
          <v-list-item-action >
            <v-btn icon target="_blank" @click="downloadFile(item.link)">
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
  name: "diags",
  data: () => ({
    selected: null,
    dialog: false,
    errorText : "Oups! Il y a eu une erreur",
    loadingText : "Chargement des données",
    filter: "",
    overlay: false,
    alertOverlay: false,
    downloadButtonVisible: false,
    urlResidenceId: "",
    items: {
      BSDA: {
        description: "Bordereau de Suivi de déchets Amiante",
        icon: "assignment",
        class: "orange black--text"
      },
      CANALISATION: {
        description: "Rapport d'Inspection des Canalisations",
        icon: "calendar_view_day",
        class: "blue white--text"
      },
      DAPP: {
        description: "Diagnostic Amiante Parties Privatives",
        icon: "vpn_key",
        class: "orange black--text"
      },
      DPE: {
        description: "Diagnostic des Performances Energétiques",
        icon: "bar_chart",
        class: "green white--text"
      },
      DTA: {
        description: "Dossier Technique Amiante",
        icon: "folder",
        class: "orange black--text"
      },
      ELECTRICITE: {
        description: "Etat de l'Installation Intérieure d'Electricité",
        icon: "flash_on",
        class: "red white--text"
      },
      ERP: {
        description: "Etat des Risques et Pollution",
        icon: "eco",
        class: "purple white--text"
      },
      GAZ: {
        description: "Etat de l'Installation Intérieure de Gaz",
        icon: "swap_calls",
        class: "yellow black--text"
      },
      MESURES_EMPOUSSIEREMENT: {
        description: "Analyse de l'air pour détection de fibres d'amiante",
        icon: "toys",
        class: "orange black--text"
      },
      PLAN_DE_RETRAIT: {
        description: "Plan De Retrait",
        icon: "apartment",
        class: "orange black--text"
      },
      PLOMB: {
        description: "Constat des Risques d'Exposition au Plomb",
        icon: "local_parking",
        class: "indigo white--text"
      },
      RAAT: {
        description: "Rapport Amiante Avant Travaux",
        icon: "warning",
        class: "orange black--text"
      },
      RFI: {
        description: "Rapport Final d'Intervention",
        icon: "insert_drive_file",
        class: "orange black--text"
      },
      TERMITE: {
        description: "Etat du Bâtiment relatifs à la présence de termites",
        icon: "bug_report",
        class: "brown white--text"
      },
      TOITURE: {
        description: "Rapport d'Inspection des toitures",
        icon: "house",
        class: "blue white--text"
      }
    }
  }),
  created() {
    if (this.$store.state.currentResidence) {
      this.selected = this.$store.state.currentResidence
    }
  },
  mounted() {

  },
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
        this.$store.dispatch("getResidenceDocs", newValue.residenceId).then((documents)=> {
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
        this.selected = newValue
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
      this.downloadButtonVisible = this.diagDocs.filter(item=>item.active).length > 0
    },
    async downloadAll() {
      try {
        this.loadingText = "Téléchargement de vos documents"
        // console.log('overlay : ', this.overlay)
        this.overlay = true
        // console.log('overlay : ', this.overlay)

        /* TODO - Indicateur de chargement */

        const mysuccess = (data) => {
          this.forceBlobDownload(data, "silene-doc.zip")
          this.overlay = false
        }

        let documentsATelecharger = this.diagDocs.filter(item=>item.active);
        var zip = new JSZip();

        // console.log(documentsATelecharger)

        const downloadFileFromUrl = async (fileUrl) => {
          // console.log('Début traitement du fichier %s ', fileToDownload.sharepointServerRelativeUrl)
          return this.$store
              .dispatch("getDiagsDoc", fileUrl)
        }

        const processAFile = async (fileToDownload) => {

          return downloadFileFromUrl(fileToDownload).then((downloadedFile) => {

            var filename = "";
            var disposition = downloadedFile.headers["content-disposition"]
            if (!disposition) {
              disposition = downloadedFile.headers["Content-Disposition"]
            }
            if (disposition && disposition.indexOf('attachment') !== -1) {
                var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
                var matches = filenameRegex.exec(disposition);
                if (matches != null && matches[1]) {
                  filename = matches[1].replace(/['"]/g, '');
                }
            }
            zip.file(filename, new Blob([downloadedFile.data]));
            // console.log('Traitement du fichier %s terminé', filename)
          }).catch ((e) => console.error('Erreur lors du téléchargement / insertion dans zip',e))
        }

        const processFilesToDownload = async (filesToDownload) => {
          return Promise.all(filesToDownload.map(file => processAFile(file.link)))
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
    downloadFile(urlDiagDoc) {
      // console.log("downloadFile ; ", urlDiagDoc)
      this.$store
        .dispatch("getDiagsDoc", urlDiagDoc)
        .then((downloadedFile) => {
          /* Récupère le nom du fichier */
          var filename = "";
          var disposition = downloadedFile.headers["content-disposition"]
          if (!disposition) {
            disposition = downloadedFile.headers["Content-Disposition"]
          }
          if (disposition && disposition.indexOf('attachment') !== -1) {
              var filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
              var matches = filenameRegex.exec(disposition);
              if (matches != null && matches[1]) {
                filename = matches[1].replace(/['"]/g, '');
              }
          }
          this.forceFileDownload(downloadedFile, filename);
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
    getTypeItemsClass: function(type) {
      let defaultClass = "blue white--text";
      // console.log('Récupération de classe pour : ', type, this.items[type])

      if (this.items[type]) {
        // console.log('Objet : ', this.items[type].class)
        return this.items[type].class;
      } else {
        return defaultClass;
      }
    },
    getTypeItemsIcon: function(type) {
      let defaultIcon = "bug_report";
      if (this.items[type]) {
        return this.items[type].icon;
      } else {
        return defaultIcon;
      }
    },
    filterResidence: function(item, queryText) {
      return filterResidence(item, queryText)
    }

  },
  computed: {
    ...mapState({
      diagDocs: state => {
        return state.diagDocs.fullList;
      },
      currentResidence: state => {
        return state.currentResidence
      }
    }),
    residences() {
      var filteredResidences = this.$store.state.sharepointResidences.fullList;

      var mapResidences = filteredResidences.map(item => {
        return item;
      });

      return mapResidences;
    },
    diagDocs() {
      return this.$store.state.diagDocs.fullList.filter(item => {
        /* On passe filtered a true quand on veut voir l'item */
        let filtered = false;
        if (
          removeAccent(item.type.toLowerCase()).indexOf(
            removeAccent(this.filter.toLowerCase())
          ) > -1
        ) {
          filtered = true;
        }
        if (
          removeAccent(item.fileName.toLowerCase()).indexOf(
            removeAccent(this.filter.toLowerCase())
          ) > -1
        ) {
          filtered = true;
        }

        return filtered;
      });
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