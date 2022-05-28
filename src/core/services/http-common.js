import axios from "axios";

export default axios.create({
  baseURL: "https://my-json-server.typicode.com/AW-StreamWeb/Fake-API/api/v1",
  headers: { "Content-type": "application/json" },
});
