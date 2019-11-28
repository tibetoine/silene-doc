<template>
  <v-container>
    <v-autocomplete
      label="Résidences"
      :items="residences"
      v-model="selected"
      color="blue-grey lighten-2"
      item-value="residence"
      prepend-icon="mdi-city"
      return-object
      solo
      :filter="filterResidence"
    >
      <template v-slot:selection="data">
        <v-chip
          :input-value="data.selected"
          color="blue-grey lighten-2"
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
          <v-list-item-action>
            <v-btn icon @click="dialog = true">
              <v-icon color="grey">info</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
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

export default {
  name: "sharepoint",
  data: () => ({
    selected: null,
    dialog: false,
    filter: "",
    items: {
      Devis: {
        description: "Bordereau de Suivi de déchets Amiante",
        icon: "assignment",
        class: "orange black--text"
      },
      CCTP: {
        description: "Rapport d'Inspection des Canalisations",
        icon: "calendar_view_day",
        class: "blue white--text"
      }
    }
  }),
  watch: {
    selected(newValue) {
      this.$store.dispatch("setCurrentResidence", newValue);
      this.$store.dispatch("getSharepointResidenceDocs", newValue);
    },
    currentResidence(newValue) {
      if (newValue) {
        this.selected = newValue;
      }
    }
  },
  methods: {
    downloadFile(item) {
      console.log(
        "item.sharepointServerRelativeUrl : ",
        item.sharepointServerRelativeUrl
      );
      this.$store
        .dispatch("getSharepointDoc", item.sharepointServerRelativeUrl)
        .then(() => {
          let downloadedFile = this.$store.state.sharepointDownloadedDoc;
          if (downloadedFile) {
            console.log("downloadedFile : ", downloadedFile);
            console.log(
              "contentType : ",
              downloadedFile.headers["content-type"]
            );
          }

          /* Récupère le nom du fichier */
           var parts = item.sharepointServerRelativeUrl.split("/");
          var fileName = parts[parts.length - 1];

          console.log("FileName: " , fileName)
          this.forceFileDownload(downloadedFile, fileName);
        });
    },
    forceFileDownload(response, fileName) {
      const url = window.URL.createObjectURL(new Blob([response.data]));
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
        let disabled = !item.libraries || item.libraries.length <= 0;
        item.disabled = disabled;
        return item;
      });
    },
    sharepointDocs() {
      return this.$store.state.sharepointDocs.fullList.filter(item => {
        /* On passe filtered a true quand on veut voir l'item */
        let filtered = false;
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
    }
  }
};
</script>
