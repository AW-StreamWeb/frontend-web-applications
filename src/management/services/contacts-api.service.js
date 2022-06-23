import http from "../../core/services/http-common";
export class ContactsApiService {
  getAll() {
    return http.get("/contacts");
  }
  getById(id) {
    return http.get(`/contacts/${id}`);
  }
  create(data) {
    return http.post("/contacts", data);
  }
  getByUserId(userId){
    return http.get(`/users/${userId}/contacts`)
  }

  update(id, data) {
    return http.put(`/contacts/${id}`, data);
  }
  delete(id) {
    return http.delete(`/contacts/${id}`);
  }
  findByName(name) {
    return http.get(`/contacts?name=${name}`);
  }
}

export default new ContactsApiService();
