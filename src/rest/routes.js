import api from './api'

export default {
  getDiags: (residenceId) => api.get(`api-ged-prem/residences/${residenceId}/docs`)
  
}
