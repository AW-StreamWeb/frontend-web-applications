import http from "../../core/services/http-common";
export default class UsersApiService {
  getUsers() {
    return http.get("/users");
  }
  singIn(data) {
    return http.post("/signin", data);
  }
  singUp(data) {
    return http.post("/signup", data);
  }
  getCurrentUser(){
    return localStorage.getItem('user')
  }
  update(id, data) {
    return http.put(`/users/${id}`, data);
  }
  delete(id) {
    return http.delete(`/users/${id}`);
  }
  setCurrentUser(data){
    localStorage.setItem('user', data);
  }
  signOut(){
    localStorage.removeItem('user');
  }

}

