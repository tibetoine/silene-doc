import axios from "axios";
import { stringify } from "qs";

const axiosInstance = axios.create({
  transformRequest: [
    function(data) {
      return stringify(data);
    }
  ]
});
const url = path => {
  var separator = '/';
  if (path && path.startsWith('/')){
    separator = '';
  }
  return window.location.origin + separator + path;
}

export default {
  get: async path => {
    try {
      var obj = await axiosInstance.get(url(path));
    } catch (error) {
      console.error(error);
    }
    return obj;
  },
  getFile: async path => {
    try {
      var obj = await axiosInstance.get(url(path), {responseType:'arraybuffer'});
    } catch (error) {
      console.error(error);
    }
    return obj;
  },
  getDiagFile: async path => {
    try {
      var obj = await axiosInstance.get(url(path), {responseType:'blob'});
      // console.log(obj)
    } catch (error) {
      console.error(error);
    }
    return obj;
  }
};
