import axios from "axios";

export default axios.create({
  baseURL: "https://fake-api-inventex.herokuapp.com/",
  headers: { "Content-type": "application/json" },
});
