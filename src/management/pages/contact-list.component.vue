<template>
  <pv-menu-bar></pv-menu-bar>

  <pv-tiered-menu></pv-tiered-menu>

  <pv-layout-main>
    <h1>CONTACTS</h1>
    <div>
      <div class="card">
        <pv-toolbar class="mb-4 bg-white-alpha-10">
          <template #start>
            <pv-button
              label="New"
              icon="pi pi-plus"
              class="p-button-success mr-2"
              @click="openNew"
            />
            <pv-button
              label="Delete"
              icon="pi pi-trash"
              class="p-button-danger"
              @click="confirmDeleteSelected"
              :disabled="!selectedContacts || !selectedContacts.length"
            />
          </template>
          <template #end>
            <pv-button
              label="Export"
              icon="pi pi-upload"
              class="p-button-help"
              @click="exportToCSV($event)"
            />
          </template>
        </pv-toolbar>
        <pv-data-table
          ref="dt"
          :value="contacts"
          v-model:selection="selectedContacts"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 15]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} contacts"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="table-header flex flex-column md:flex-row md:justify-content-between"
            >
              <h5 class="mb-2 md:m-0 p-as-md-center text-xl">
                Manage Contacts
              </h5>
              <span class="p-input-icon-left"
              ><i class="pi pi-search" /><pv-input-text
                v-model="filters['global'].value"
                placeholder="Search..."
              />
              </span>
            </div>
          </template>
          <pv-column
            selectionMode="multiple"
            style="width: 3rem"
            :exportable="false"
          ></pv-column>
          <pv-column
            field="id"
            header="Id"
            :sortable="true"
            style="min-width: 3rem"
          ></pv-column>
          <pv-column
            field="name"
            header="Name"
            :sortable="true"
            style="min-width: 8rem"
          ></pv-column>
          <pv-column
            field="description"
            header="Last Name"
            :sortable="true"
            style="min-width: 12rem"
          ></pv-column>
          <pv-column
            field="lifetime"
            header="Birthday"
            :sortable="true"
            style="min-width: 8rem"
          ></pv-column>
          <pv-column
            field="active"
            header="Status"
            :sortable="true"
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <pv-tag
                v-if="slotProps.data.active === 'Active'"
                severity="success"
              >{{ slotProps.data.active }}</pv-tag
              >
              <pv-tag v-else severity="info">{{
                  slotProps.data.active
                }}</pv-tag>
            </template>
          </pv-column>


          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded"
                @click="editContact(slotProps.data)"
              />
              <pv-button
                icon="pi pi-trash"
                class="p-button-text p-button-rounded"
                @click="confirmDeleteContact(slotProps.data)"
              />
            </template>
          </pv-column>

        </pv-data-table>
      </div>
      <pv-toast/>



      <pv-dialog
        v-model:visible="contactDialog"
        :style="{ width: '450px' }"
        header="Contact Information"
        :modal="true"
        class="p-fluid"
      >
        <div class="field">
          <span class="p-float-label">
            <pv-input-text
              type="text"
              id="name"
              v-model.trim="contact.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !contact.name }"
            />
            <label for="name">Name</label>
            <small class="p-error" v-if="submitted && !contact.name"
            >Name is required.</small
            >
          </span>
        </div>
        <div class="field">
          <span class="p-float-label">
            <pv-textarea
              id="description"
              v-model="contact.description"
              required="false"
              rows="2"
              cols="2"
            />
            <label for="description">Description</label>
          </span>
        </div>

        <div class="field">
          <span class="p-float-label">
            <pv-input-mask
              id="lifetime"
              v-model="contact.lifetime"
              mask="99/99/9999"
              required="true"
            />
            <label for="lifetime">Birthday</label>
          </span>
        </div>

        <div class="field">
          <pv-dropdown
            id="active"
            v-model="contact.active"
            :options="statuses"
            optionLabel="label"
            placeholder="Select an Status"
          >
            <template #value="slotProps">
              <div v-if="slotProps.value && slotProps.value.value">
                <span>{{ slotProps.value.label }}</span>
              </div>
              <div v-else-if="slotProps.value && !slotProps.value.value">
                <span>{{ slotProps.value }}</span>
              </div>
              <span v-else>{{ slotProps.placeholder }}</span>
            </template>
          </pv-dropdown>
        </div>
        <template #footer>
          <pv-button
            label="Cancel"
            icon="pi pi-times"
            class="p-button-text"
            @click="hideDialog"
          />
          <pv-button
            label="Save"
            icon="pi pi-check"
            class="p-button-text"
            @click="saveContact"
          />
        </template>
      </pv-dialog>
      <pv-dialog
        v-model:visible="deleteContactDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="contact"
          >Are you sure you want to delete <b>{{ contact.name }}</b></span
          >
        </div>
        <template #footer>
          <pv-button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteContactDialog = false"
          />
          <pv-button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteContact"
          />
        </template>
      </pv-dialog>
      <pv-dialog
        v-model:visible="deleteContactsDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" syle="font-size: 2rem" />
          <span v-if="selectedContacts"
          >Are you sure you want to delete the selected contacts?</span
          >
        </div>
        <template #footer>
          <pv-button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteContactsDialog = false"
          />
          <pv-button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteSelectedContacts"
          />
        </template>
      </pv-dialog>
    </div>
  </pv-layout-main>

</template>


<script>
import pvMenuBar from "../../core/components/pv-menu-bar.vue";
import pvTieredMenu from "../../core/components/pv-tiered-menu.vue";
import pvLayoutMain from "../../core/components/pv-layout-main.vue";
import { ContactsApiService} from "../services/contacts-api.service";
import { FilterMatchMode } from "primevue/api";

export default {
  name: "contact-list.component",
  components: {
    pvMenuBar,
    pvTieredMenu,
    pvLayoutMain,
  },
  data() {
    return {
      contacts: [],
      contactDialog: false,
      deleteContactDialog: false,
      deleteContactsDialog: false,
      contact: {},
      selectedContacts: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: "Active", value: "active" },
        { label: "Inactive", value: "inactive" },
      ],
      contactsService: null,
      user:null,
    };
  },
  created() {
    this.user = JSON.parse(localStorage.getItem('user'));
    this.contactsService = new ContactsApiService();
    this.contactsService.getByUserId(this.user.id).then((response) => {
      this.contacts = response.data;
      this.contacts.forEach((contact) =>
        this.getDisplayableContact(contact)
      );
      console.log(this.contacts);
    });
    this.initFilters();
  },
  methods: {
    getDisplayableContact(contact) {
      contact.active= contact.active
        ? this.statuses[0].label
        : this.statuses[1].label;
      return contact;
    },
    getStorableContact(displayableContact) {
      return {
        "name": displayableContact.name,
        "description": displayableContact.description,
        "lifetime": displayableContact.lifetime,
        "active": displayableContact.active.label === "Active",
        "userId":this.user.id,
      };
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    findIndexById(id) {
      return this.contacts.findIndex((contact) => contact.id === id);
    },
    openNew() {
      this.contact = {};
      this.submitted = false;
      this.contactDialog = true;
    },
    hideDialog() {
      this.contactDialog = false;
      this.submitted = false;
    },
    async saveContact() {
      this.submitted = true;
      let currentId=this.contact.id;
      if (this.contact.name.trim()) {
        if (this.contact.id) {
          //this.contact.status = this.contact.status.label ? this.contact.status.label: this.contact.status;
          this.contact=this.getStorableContact(this.contact);
          this.contactsService.update(currentId,this.contact).then((data)=>{
            data.data=this.getDisplayableContact(data.data);
            this.contacts[this.findIndexById(data.data.id)] = data.data;
            this.$toast.add({
              severity:'success',
              summary: 'Successful',
              detail: 'Contact Updated',
              life: 3000});/*CHANGE*/
          })

        } else {
          this.contact.id = 0;
          this.contact = this.getStorableContact(this.contact);
          this.contactsService.create(this.contact).then((response) => {
            this.contact = this.getDisplayableContact(response.data);
            this.contacts.push(this.contact);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Contact Created",
              life: 3000,
            });
            console.log(response);
          });
        }
      }
      this.contactDialog = false;
      this.contact = {};
    },
    editContact(contact) {
      this.contact = { ...contact };
      this.contactDialog = true;
    },
    confirmDeleteContact(contact) {
      this.contact = contact;
      this.deleteContactDialog = true;
    },
    deleteContact() {
      this.contactsService.delete(this.contact.id).then((response) => {
        this.contacts = this.contacts.filter(
          (t) => t.id !== this.contact.id
        );
        this.deleteContactDialog = false;
        this.contact = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Contact Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },
    exportToCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteContactsDialog = true;
    },
    deleteSelectedContacts() {
      this.selectedContacts.forEach((contact) => {
        this.contactsService.delete(contact.id).then((response) => {
          this.contacts = this.contacts.filter(
            (t) => !this.selectedContacts.includes(t)
          );
          this.deleteContactsDialog=false;
          this.selectedContacts=null;
          this.$toast.add({
            severity: "success",
            summary: "Successful",
            detail: "Products Deleted",
            life: 3000,
          });
          console.log(response);
        });
      });
      this.deleteContactsDialog = false;
    },
  },
};
</script>

<style scoped>

</style>
