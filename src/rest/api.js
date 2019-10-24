import axios from "axios";
import { stringify } from "qs";

const axiosInstance = axios.create({
  transformRequest: [
    function(data) {
      return stringify(data);
    }
  ]
});
const url = path => window.location.origin + "/" + path;

export default {
  get: async path => {
    console.log("get", path);
    try {
      var obj = await axiosInstance.get(url(path));
    } catch (error) {
      console.error(error);
    }
    console.log("returning", obj);
    return obj;
  }
};
