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
    >
      <template v-slot:selection="data">
        <v-chip
          :input-value="data.selected"
          color="blue-grey lighten-2"
          class="white--text"
          v-on="data.on"
        >
          <v-icon left>mdi-office-building</v-icon>
          <span>{{data.item.residence.residenceId}} - {{data.item.residence.residenceName}}</span>
        </v-chip>
      </template>
      <template v-slot:item="{ item }">
        <v-list-item-avatar
          :color="item.disabled ? 'blue lighten-5':'blue lighten-1'"
          class="headline font-weight-light white--text"
        >{{ item.residence.residenceName.charAt(0) }}</v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.residence.residenceId"></v-list-item-title>
          <v-list-item-subtitle v-text="item.residence.residenceName"></v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-icon :disabled="item.disabled">mdi-archive</v-icon>
        </v-list-item-action>
      </template>
    </v-autocomplete>
    <v-text-field
      v-model="filter"
      label="Filtrer ici "
      outlined
    ></v-text-field>

    <v-list v-if="sharepointDocs.length > 0" two-line>
      <template v-for="(item) in sharepointDocs">
        <v-list-item :key="item.title">
          <v-list-item-avatar>
            <v-icon v-bind:class="getTypeItemsClass(item.typeLabel)">{{getTypeItemsIcon(item.typeLabel)}}</v-icon>
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
            <v-btn icon target="_blank" :href="item.link">
              <v-icon color="grey">get_app</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
    <v-alert v-else type="info">Aucune donnée avec ces critères. 
      
      (Avez-vous choisi une résidence ?)</v-alert>
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
import { removeAccent } from "../shared/helper";

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
    selected(newValue, oldValue) {
      console.log(newValue, " - ", oldValue);
      // so now comparing your old to new array you would know if a state got
      // added or removed, and fire subsequent methods accordingly.
      console.log("dsfdsfs", newValue.residence.residenceId)
      this.$store.dispatch('setCurrentResidence', newValue.residence.residenceId)
      console.log("yeakjh", newValue.residence.libraries[0])
      console.log("sdfdsfdsfds", newValue.residence.libraries)
      this.$store.dispatch("getSharepointResidenceDocs", newValue.residence);
    }
  },
  methods: {
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
    }
  },
  computed: {
    ...mapState({
      
    }),
    residences() {
      var filteredResidences = this.$store.state.sharepointResidences.fullList.filter(
        item => {
          /* On passe filtered a true quand on veut voir l'item */
          let filtered = false;
          if (
            removeAccent(item.residenceId.toLowerCase()).indexOf(
              removeAccent(this.filter.toLowerCase())
            ) > -1
          ) {
            filtered = true;
          }
          if (
            removeAccent(item.residenceName.toLowerCase()).indexOf(
              removeAccent(this.filter.toLowerCase())
            ) > -1
          ) {
            filtered = true;
          }

          return filtered;
        }
      );

      return filteredResidences.map(item => {
        return {
          residence: item,
          disabled: !item.libraries || item.libraries.length <= 0
        };
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
