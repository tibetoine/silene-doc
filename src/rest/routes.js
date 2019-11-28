import api from './api'

export default {
  getDiags: (residenceId) => api.get(`api-ged-prem/residences/${residenceId}/docs`),
  getPremResidences : () => api.get(`api-ged-prem/residences`),
  getSharepointResidences: () => api.get(`api-ged-sharepoint/residences`),
  getSharepointResidenceDocs: (residenceId, urlArray) => api.get(`api-ged-sharepoint/residences/${residenceId}/docs?libraryNames=${urlArray}`),
  getSharepointDocByUrl: (urlDoc) => api.getFile(`api-ged-sharepoint/residences/doc?urlDoc=${urlDoc}`)
  
}
