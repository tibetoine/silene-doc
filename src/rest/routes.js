import api from './api'

export default {
  getDiags: (residenceId) => api.get(`api-ged-prem/residences/${residenceId}/docs`),
  getPremResidences : () => api.get(`api-ged-prem/residences`),
  getSharepointResidences: () => api.get(`api-ged-sharepoint/residences`),
  getSharepointResidenceDocs: (residenceId) => api.get(`api-ged-sharepoint/residences/${residenceId}/docs`),
  getSharepointResidencePlans: (residenceId) => api.get(`api-ged-sharepoint/residences/${residenceId}/plans`),
  getSharepointDocByUrl: (urlDoc) => {
    let url = `api-ged-sharepoint/residences/doc?urlDoc=${urlDoc}`
    // console.log(url)
    return api.getFile(url)
  },
  getDiagDocByUrl: (urlDoc) => api.getDiagFile(urlDoc)

}
