import http from "../../core/services/http-common";
export class MachinesApiService {
  getAll() {
    return http.get("/machines");
  }
  getById(id) {
    return http.get(`/machines/${id}`);
  }
  getByUserId(userId){
    return http.get(`/users/${userId}/machines`)
  }
  create(data) {
    return http.post("/machines", data);
  }
  update(id, data) {
    return http.put(`/machines/${id}`, data);
  }
  delete(id) {
    return http.delete(`/machines/${id}`);
  }
  findByName(name) {
    return http.get(`/machines?name=${name}`);
  }
}

export default new MachinesApiService();