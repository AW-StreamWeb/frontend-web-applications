<template>
  <div class="layout-sidebar align-content-center">
    <tiered-menu :model="items" class="bg-blue-700 block font-normal " >
    </tiered-menu>
    <pv-button class="pi pi-fw pi-power-off" @click="this.signOut()"></pv-button>
    <pv-split-button class="ml-3 mt-5" label="Language" :model="languages"></pv-split-button>
  </div>
</template>

<script>
import UsersApiService from "../../management/services/users-api.service";

export default {
  name: "pv-tiered-menu",
  UserService:null,
  created() {
    this.UserService=new UsersApiService();
  },
  data() {
    return {
      checked: false,
      languages:[
        {
          label: "ES",
          command: ()=>{
            this.changeToSpanish();
          }
        },
        {
          label: "EN",
          command: ()=>{
            this.changeToEnglish();
          }
        }
      ],
      items: [
        {
          label: "Home",
          icon: "pi pi-fw pi-home",
          to: "/home",
        },
        {
          label: "Inventory",
          icon: "pi pi-fw pi-pencil",
          to: "/inventory",
        },
        {
          label: "Contacts",
          icon: "pi pi-fw pi-user",
          to: "/contacts",
        },
        {
          label: "Machines",
          icon: "pi pi-fw pi-calendar",
          to: "/machines",
        },
        {
          label: "Finances",
          icon: "pi pi-fw pi-calendar",
          to: "/finances",
        },
        {
          separator: true,
        },
      ],
    };
  },
  methods: {
    signOut(){
      this.UserService.signOut();
      this.$router.push("/")
    },
    changeToSpanish() {
      this.items[0].label="Inicio";
      this.items[1].label="Inventario";
      this.items[2].label="Contactos";
      this.items[3].label="Maquinas";
      this.items[4].label="Finanzas";
      this.items[5].label="Cerrar Sesion";
    },
    changeToEnglish() {
      this.items[0].label="Home";
      this.items[1].label="Inventory";
      this.items[2].label="Contacts";
      this.items[3].label="Machines";
      this.items[4].label="Finances";
      this.items[5].label="Logout";
    },
  }
};
</script>

<style scoped>
.layout-sidebar {
  position: absolute;
  width: 250px;
  height: calc(100vh - 5.5rem);
  z-index: 999;
  overflow-y: auto;
  user-select: none;
  top: 5.2rem;
  left: 0.5rem;
  background-color: var(--blue-700);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0px 3px 5px rgba(0, 0, 0, 0.02), 0px 0px 2px rgba(0, 0, 0, 0.05),
    0px 1px 4px rgba(0, 0, 0, 0.08);
}

</style>
