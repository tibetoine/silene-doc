import Vue from "vue";
import Vuex from "vuex";
import rest from "../rest/routes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    diagDocs: {
      fullList: []
    },
    sharepointDocs: {
      fullList: []
    },
    sharepointPlans: {
      fullList: []
    },
    error: {
      errorState: false,
      errorMessage: "Aucune erreur enregistré"
    },
    currentResidence: null,    
    sharepointResidences: {
      selectedResidence: null,
      fullList: []
    },
    sharepointDownloadedDoc : null
  },
  mutations: {
    SET_DOCS_LIST(state, payload) {
      state.diagDocs.fullList = payload;
    },
    SET_SHAREPOINT_RESIDENCES_LIST(state, payload) {
      state.sharepointResidences.fullList = payload;
    },
    SET_SHAREPOINT_DOC(state, payload) {
      state.sharepointDownloadedDoc = payload;
    },
    SET_ERROR(state, payload) {
      state.error.errorState = true;
      state.error.errorMessage = payload;
    },
    SET_CURRENT_RESIDENCE(state, payload) {
      state.currentResidence = payload;
    },
    SET_SHAREPOINT_DOCS_LIST(state, payload) {
      state.sharepointDocs.fullList = payload;
    },
    SET_SHAREPOINT_PLANS_LIST(state, payload) {
      state.sharepointPlans.fullList = payload;
    },
    RESET_ERROR(state) {
      state.error.errorState = false;
      state.error.errorMessage = null;
    }
  },
  actions: {
    async setCurrentResidence (context, residence) {
      // console.log('Residence', residence)
      /* Enregistrement dans le store */
      context.commit("SET_CURRENT_RESIDENCE", residence);
    },
    async getResidenceDocs(context, idResidence) {
      context.commit("RESET_ERROR");
      try {
        const response = await rest.getDiags(idResidence);
        const diagDocs = response.data.result;
        /* 2/ Enregistrement dans le store */
        context.commit("SET_DOCS_LIST", diagDocs);
      } catch (error) {
        // Gestion de l'erreur
        // Toggle message erreur.
        console.error(error);
        context.commit(
          "SET_ERROR",
          "Impossible de récupérer les documents diagnostics depuis l'API",
          error
        );
      }
    },    
    async getSharepointResidences(context) {
      try {
        const response = await rest.getSharepointResidences();
        const residences = response.data;
        /* 2/ Enregistrement dans le store */
        context.commit("SET_SHAREPOINT_RESIDENCES_LIST", residences);
      } catch (error) {
        // Gestion de l'erreur
        // Toggle message erreur.
        context.commit(
          "SET_ERROR",
          "Impossible de récupérer les documents diagnostics depuis l'API",
          error
        );
      }
    },
    async getSharepointDoc(context, urlDoc) {
      try {
        const response = await rest.getSharepointDocByUrl(urlDoc);
        /* TODO Manipulation d'un fichier */
        const sharepointDocResponse = response;
        /* 2/ Enregistrement dans le store */
        context.commit("SET_SHAREPOINT_DOC", sharepointDocResponse);
      } catch (error) {
        // Gestion de l'erreur
        // Toggle message erreur.
        context.commit(
          "SET_ERROR",
          "Impossible de récupérer ce document Sharepoint",
          error
        );
      }
    },
    async getSharepointResidencePlans (context, residence) {
      // console.log('getSharepointResidencePlans - residence : ', residence)
      try {
        // console.log('Get avec les params residenceId: ',residenceId, ' arrayUrl : ', arrayUrl )
        const response = await rest.getSharepointResidencePlans(residence.residenceId);
        const documents = response.data.result;
        /* 2/ Enregistrement dans le store */
        context.commit("SET_SHAREPOINT_PLANS_LIST", documents);
      } catch (error) {
        // Gestion de l'erreur
        // Toggle message erreur.
        context.commit(
          "SET_ERROR",
          "Impossible de récupérer les plans sharepoint depuis l'API",
          error
        );
      }
    },
    async getSharepointResidenceDocs (context, residence) {

      
      try {
        // console.log('Get avec les params residenceId: ',residence.residenceId)

        const response = await rest.getSharepointResidenceDocs(residence.residenceId);
        const documents = response.data.result;
        /* 2/ Enregistrement dans le store */
        context.commit("SET_SHAREPOINT_DOCS_LIST", documents);
      } catch (error) {
        // Gestion de l'erreur
        // Toggle message erreur.
        context.commit(
          "SET_ERROR",
          "Impossible de récupérer les documents sharepoint depuis l'API",
          error
        );
      }
    }
  },
  modules: {},
  getters: {
    getDiagDocs: state => {
      // console.log("Returnin : ", state.diagDocs);
      return state.diagDocs;
    },
    getSharepointDownloadDoc : state => state.sharepointDownloadedDoc
  }
});
