<template>
  <v-container>
    <v-autocomplete
      label="Résidences"
      v-model="selected"
      :items="residences"
      color="blue-grey lighten-2"
      item-text="label"
      item-value="idResidence"
      prepend-icon="mdi-city"
    ></v-autocomplete>
    <v-list two-line>
      <template v-for="(item) in maList">
        <v-list-item :key="item.title">
          <v-list-item-avatar>
            <v-icon v-bind:class="getTypeItemsClass(item.type)">{{getTypeItemsIcon(item.type)}}</v-icon>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-html="item.fileName"></v-list-item-title>
            <v-list-item-subtitle v-html="item.type"></v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-btn icon>
              <v-icon color="grey lighten-1">get_app</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>
      </template>
    </v-list>
  </v-container>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "diags",
  data: () => ({
    selected: null,
    residences: [
      { label: "0070 - Dolto", idResidence: "0070" },
      { label: "0079 - Moulin de la Butte", idResidence: "0079" },
      { label: "0901 - Lycée expérimental", idResidence: "0901" },
      { label: "0003 - Gambetta", idResidence: "0003" },
      { label: "0241 - Artimon", idResidence: "0241" },
      { label: "0082 - Aviateurs", idResidence: "0082" },
      { label: "0112 - Suzanne Lenglen", idResidence: "0112" },
      { label: "0170 - Aéris", idResidence: "0170" },
      { label: "0031 - Provence", idResidence: "0031" }
    ],
    items: 
      {
        BSDA: {
          description: "Bordereau de Suivi de déchets Amiante",
          icon: "book",
          class: "blue white--text"
        }
      ,  CANALISATION: {
          description: "Rapport d'Inspection des Canalisations",
          icon: "waves",
          class: "blue white--text"
        }
      ,  DAPP: {
          description: "Diagnostic Amiante Parties Privatives",
          icon: "vpn_key",
          class: "blue white--text"
        }
      ,
        DPE: {
          description: "Diagnostic des Performances Energétiques",
          icon: "bar_chart",
          class: "blue white--text"
        }
      ,  DTA: {
          description: "Dossier Technique Amiante",
          icon: "assignment",
          class: "blue white--text"
        }
      ,
        ELECTRICITE: {
          description: "Etat de l'Installation Intérieure d'Electricité",
          icon: "flash_on",
          class: "orange black--text"
        }
      ,
        ERP: {
          description: "Etat des Risques et Pollution",
          icon: "emoji_nature",
          class: "blue white--text"
        }
      ,
        GAZ: {
          description: "Etat de l'Installation Intérieure de Gaz",
          icon: "swap_calls",
          class: "brown white--text"
        }
      ,
        PLAN_DE_RETRAIT: {
          description: "Plan De Retrait",
          icon: "subdirectory_arrow_left",
          class: "blue white--text"
        }
      ,
        PLOMB: {
          description: "Constat des Risques d'Exposition au Plomb",
          icon: "polymer",
          class: "blue white--text"
        }
      ,
        RAAT: {
          description: "Rapport Amiante Avant Travaux",
          icon: "assignment_late",
          class: "red white--text"
        }
      ,
        RFI: {
          description: "Rapport Final d'Intervention",
          icon: "gavel",
          class: "blue white--text"
        }
      ,
        TERMITE: {
          description: "Etat du Bâtiment relatifs à la présence de termites",
          icon: "bug_report",
          class: "blue white--text"
        }
      ,
        TOITURE: {
          description: "Rapport d'Inspection des toitures",
          icon: "house",
          class: "blue white--text"
        }
      }
      
    
  }),
  watch: {
    selected(newValue, oldValue) {
      console.log(newValue, " - ", oldValue);
      // so now comparing your old to new array you would know if a state got
      // added or removed, and fire subsequent methods accordingly.
      // this.$store.commit('changeSelectedResidence', newValue)
      this.$store.dispatch("getResidenceDocs", newValue);
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
    getTypeItemsIcon:  function(type) {
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
        console.log("Ouai ", state.diagDocs.fullList);
        return state.diagDocs.fullList;
      }
    }),
    maList() {
      return this.$store.state.diagDocs.fullList;
    }
  }
};
</script>
