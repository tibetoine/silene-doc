<template>
  <v-container>
    <v-autocomplete
      label="Résidences"
      :items="residences"
      v-model="selected"
      color="blue-grey lighten-2"
      item-text="residence.residenceName"
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
      label="Filtrer ici par nom ou par type (Par exemple 'DAPP' ou un numéro de lot de cette résidence)"
      outlined
    ></v-text-field>

    <!-- <v-alert v-else type="info">Aucune donnée avec ces critères.(Avez-vous choisi une résidence ?)</v-alert> -->
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
    filter: ""
  }),
  created() {
    /* Charge les données de résidence Sharepoint */
    // console.log('chargement des données')
    this.$store.dispatch("getSharepointResidences");
  },
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
    isDisabled: function(residence) {
      if (residence && residence.libraries && residence.libraries.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
  computed: {
    ...mapState({
      sharepointResidence: state => {
        // console.log("Ouai ", state.diagDocs.fullList);
        return state.diagDocs.fullList;
      }
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
    }
  }
};
</script>
