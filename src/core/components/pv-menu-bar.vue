<template>

<header>
  <pv-menubar :model="items" class="justify-content-between bg-blue-900 border-none elements">
    <template #start>
      <img
        alt="logo"
        src="https://i.ibb.co/FhmymhD/Imagen1.png"
        height="40"
        class="mr-5"
      />
    </template>
    <template #end>
      <pv-input-text placeholder="Search" type="text" />
    </template>
  </pv-menubar>
</header>
      


</template>

<script>
export default {
  name: "pv-menu-bar",
  data() {
    return {
      checked: false,
      items: [
        {
          label: "Notifications",
          icon: "pi pi-fw pi-bell",
          to:"/notifications",

        },
        {
          label: "Profile",
          icon: "pi pi-fw pi-user",
          to:"/profile",
        }
      ],
    };
  },

};
</script>

<style scoped>
.border-none{
    border:none;
    border-radius: 0px;
}
.elements{
    font-weight: bold;
    color: yellow;
}
</style>