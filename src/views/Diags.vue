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
      v-if="(diagDocs.length > 0 || filter !== '')"
      v-model="filter"
      label="Filtrer ici par nom ou par type (Par exemple 'DAPP' ou un numéro de lot de cette résidence)"
      outlined
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
          <v-list-item-action>
            <v-btn icon @click="dialog = true">
              <v-icon color="grey">info</v-icon>
            </v-btn>
          </v-list-item-action>
          <v-list-item-action>
            <v-btn icon :href="item.link">
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
import { removeAccent } from "../shared/helper";

export default {
  name: "diags",
  data: () => ({
    selected: null,
    dialog: false,
    filter: "",
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
    // TODO : Validate params
    this.urlResidenceId = this.$route.query.residenceId;
    this.selected = {residence:{residenceId:this.$route.query.residenceId}}
    if (this.urlResidenceId !== "") {
      this.$store.dispatch("setCurrentResidence", this.urlResidenceId);
      this.$store.dispatch("getResidenceDocs", this.urlResidenceId);
    }
  },
  watch: {
    selected(newValue, oldValue) {
      console.log(newValue, " - ", oldValue);
      // so now comparing your old to new array you would know if a state got
      // added or removed, and fire subsequent methods accordingly.
      // this.$store.commit('changeSelectedResidence', newValue)
      this.$store.dispatch(
        "setCurrentResidence",
        newValue.residence.residenceId
      );
      this.$store.dispatch("getResidenceDocs", newValue.residence.residenceId);
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
    }
  },
  computed: {
    ...mapState({
      diagDocs: state => {
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
          residence: item
        };
      });
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
