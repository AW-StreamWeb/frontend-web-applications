<template>
  <div class="surface-card p-4 shadow-2 border-round w-full lg:w-6">
    <div class="text-center mb-5">
      <img src="https://i.ibb.co/0X3zw1N/Logo.png" alt="Logo" height="50" class="mb-3">
      <div class="text-900 text-3xl font-medium mb-3">Welcome Back</div>
      <span class="text-600 font-medium line-height-3">Don't have an account?</span>
      <router-link to="/sign-up">
        <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
      </router-link>

    </div>

    <div>
      <label for="email1" class="block text-900 font-medium mb-2">Email</label>
      <pv-input-text :id="email1" v-model="email1" type="text" class="w-full mb-3" />

      <label for="password1" class="block text-900 font-medium mb-2">Password</label>
      <pv-input-text  toggleMask :id="password1" v-model="password1" type="password" class="w-full mb-3" />

      <div class="flex align-items-center justify-content-between mb-6">

        <div class="flex align-items-center">
          <pv-checkbox :id="rememberme1" :binary="true" v-model="checked" class="mr-2"></pv-checkbox>
          <label for="rememberme1">Remember me</label>
        </div>

        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>

      </div>
      <pv-button label="Sign In" icon="pi pi-user" class="w-full" @click="logeado()"></pv-button>
    </div>
  </div>
</template>

<script>
import UsersApiService from "../management/services/users-api.service";

export default {
  name: "sign-in.component",
  UserService:null,
  created() {
    this.UserService=new UsersApiService();
  },
  data() {
    return {
      email1: "",
      password1: "",
    }
  },
  methods:{
    logeado(){
      let data={
        "email":this.email1,
        "password":this.password1
      };
      this.UserService.singIn(data).then((res) => {
        this.UserService.setCurrentUser(JSON.stringify(res.data.user));
        console.log(res.data.user);
        this.$router.push('/home');
      });
    },


  }
};
</script>

<style scoped>
.container1
{
  position: center;
  bottom: 0px;
  padding-top: 10px;
  padding-left: 650px;
}
.p-float-label{
  position: center;
  bottom: 0px;
  padding-top: 150px;
  padding-left: 650px;
}
</style>
