import http from "../../core/services/http-common";

export default class ProductsApiService{
  getProducts() {
    return http.get("/inventories");
  }
  getByUserId(userId){
    return http.get(`/users/${userId}/inventory`)
  }
  create(data) {
    return http.post("/inventories", data);
  }
  update(id, data) {
    return http.put(`/inventories/${id}`, data);
  }
  delete(id) {
    return http.delete(`/inventories/${id}`);
  }
}