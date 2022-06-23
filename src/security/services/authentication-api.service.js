import http from "../../core/services/http-common";

export class AuthenticationApiService {
  signUp(user) {
    // Register

  }
  signIn(user) {
    // Login
  }
  signOut() {
    // Logout
    localStorage.removeItem("user");
  }

}
