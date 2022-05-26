<template>
  <pv-menu-bar></pv-menu-bar>
  <pv-tiered-menu></pv-tiered-menu>
  <pv-layout-main>
    <h1>FINANCES</h1>
    <div>
      <div class="px-4 py-5 md:px-6 lg:px-8">
        <div class="grid justify-content-center">
          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card shadow-2 p-3 border-round">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-bold mb-3">Incomes</span>
                  <div class="text-900 font-bold text-xl">
                   {{IncomeTotal}}
                  </div>
                </div>
                <div
                  class="flex align-items-center justify-content-center bg-blue-100 border-round"
                  style="width: 2.5rem; height: 2.5rem"
                >
                  <i class="pi pi-sort-down text-blue-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="col-12 md:col-6 lg:col-3">
            <div class="surface-card shadow-2 p-3 border-round">
              <div class="flex justify-content-between mb-3">
                <div>
                  <span class="block text-500 font-bold mb-3">Spents</span>
                  <div class="text-900 font-bold text-xl">
                    {{SpentTotal}}
                  </div>
                </div>
                <div
                  class="flex align-items-center justify-content-center bg-cyan-100 border-round"
                  style="width: 2.5rem; height: 2.5rem"
                >
                  <i class="pi pi-sort-up text-cyan-500 text-xl"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
              :disabled="!selectedFinances || !selectedFinances.length"
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
          :value="finances"
          v-model:selection="selectedFinances"
          dataKey="id"
          :paginator="true"
          :rows="10"
          :filters="filters"
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          :rowsPerPageOptions="[5, 10, 15]"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} finances"
          responsiveLayout="scroll"
        >
          <template #header>
            <div
              class="table-header flex flex-column md:flex-row md:justify-content-between"
            >
              <h5 class="mb-2 md:m-0 p-as-md-center text-xl">
                Manage Finances
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
            header="Title"
            :sortable="true"
            style="min-width: 8rem"
          ></pv-column>
          <pv-column
            field="day"
            header="Day"
            :sortable="true"
            style="min-width: 8rem"
          ></pv-column>
          <pv-column
            field="quantity"
            header="Quantity"
            :sortable="true"
            style="min-width: 8rem"
          ></pv-column>
          <pv-column
            field="status"
            header="Status"
            :sortable="true"
            style="min-width: 8rem"
          >
            <template #body="slotProps">
              <pv-tag
                v-if="slotProps.data.status === 'Income'"
                severity="success"
                >{{ slotProps.data.status }}</pv-tag
              >
              <pv-tag v-else severity="info">{{
                slotProps.data.status
              }}</pv-tag>
            </template>
          </pv-column>
          <pv-column :exportable="false" style="min-width: 8rem">
            <template #body="slotProps">
              <pv-button
                icon="pi pi-pencil"
                class="p-button-text p-button-rounded"
                @click="editFinance(slotProps.data)"
              />
              <pv-button
                icon="pi pi-trash"
                class="p-button-text p-button-rounded"
                @click="confirmDeleteFinance(slotProps.data)"
              />
            </template>
          </pv-column>
        </pv-data-table>
      </div>
      <pv-dialog
        v-model:visible="financeDialog"
        :style="{ width: '450px' }"
        header="Finance Information"
        :modal="true"
        class="p-fluid"
      >
        <div class="field">
          <span class="p-float-label">
            <pv-input-text
              type="text"
              id="title"
              v-model.trim="finance.name"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !finance.name }"
            />
            <label for="title">Title</label>
            <small class="p-error" v-if="submitted && !finance.name"
              >Name is required.</small
            >
          </span>
        </div>
        <div class="field">
          <span class="p-float-label">
            <pv-input-mask
              id="day"
              v-model="finance.day"
              mask="99/99/9999"
              required="true"
            />
            <label for="description">Day</label>
          </span>
        </div>
        <div class="field">
          <span class="p-float-label">
            <pv-inputnumber
              id="quantity"
              v-model="finance.quantity"
              mode="currency"
              currency="PEN"
              locale="en-US"
            />
            <label for="description">Quantity</label>
          </span>
        </div>
        <div class="field">
          <pv-dropdown
            id="type"
            v-model="finance.status"
            :options="statuses"
            optionLabel="label"
            placeholder="Select an Type"
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
            @click="saveFinance"
          />
        </template>
      </pv-dialog>
      <pv-dialog
        v-model:visible="deleteFinanceDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" style="font-size: 2rem" />
          <span v-if="finance"
            >Are you sure you want to delete <b>{{ finance.name }}</b></span
          >
        </div>
        <template #footer>
          <pv-button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteFinanceDialog = false"
          />
          <pv-button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteMachine"
          />
        </template>
      </pv-dialog>
      <pv-dialog
        v-model:visible="deleteFinancesDialog"
        :style="{ width: '450px' }"
        header="Confirm"
        :modal="true"
      >
        <div class="confirmation-content">
          <i class="pi pi-exclamation-triangle mr-3" syle="font-size: 2rem" />
          <span v-if="selectedFinances"
            >Are you sure you want to delete the selected finances?</span
          >
        </div>
        <template #footer>
          <pv-button
            label="No"
            icon="pi pi-times"
            class="p-button-text"
            @click="deleteFinancesDialog = false"
          />
          <pv-button
            label="Yes"
            icon="pi pi-check"
            class="p-button-text"
            @click="deleteSelectedFinances"
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
import { FinancesApiService } from "../services/finances-api.service";
import { FilterMatchMode } from "primevue/api";
export default {
  name: "finance-list.component",
  components: {
    pvMenuBar,
    pvTieredMenu,
    pvLayoutMain,
  },
  data() {
    return {
      finances: [],
      financeDialog: false,
      deleteFinanceDialog: false,
      deleteFinancesDialog: false,
      finance: {},
      selectedFinances: null,
      filters: {},
      submitted: false,
      statuses: [
        { label: "Income", value: "income" },
        { label: "Spent", value: "spent" },
      ],
      financesService: null,
    };
  },
  created() {
    this.financesService = new FinancesApiService();
    this.financesService.getAll().then((response) => {
      this.finances = response.data;
      this.finances.forEach((finance) => this.getDisplayableFinance(finance));
      console.log(this.finances);
    });
    this.initFilters();
  },
  methods: {
    
    getDisplayableFinance(finance) {
      finance.status = finance.type
        ? this.statuses[0].label
        : this.statuses[1].label;
      return finance;
    },
    getStorableFinance(displayableFinance) {
      return {
        id: displayableFinance.id,
        name: displayableFinance.name,
        day: displayableFinance.day,
        quantity: displayableFinance.quantity,
        type: displayableFinance.status.label === "Income",
      };
    },
    initFilters() {
      this.filters = {
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      };
    },
    findIndexById(id) {
      return this.finances.findIndex((finance) => finance.id === id);
    },
    openNew() {
      this.finance = {};
      this.submitted = false;
      this.financeDialog = true;
    },
    hideDialog() {
      this.financeDialog = false;
      this.submitted = false;
    },
    saveFinance() {
      this.submitted = true;
      if (this.finance.name.trim()) {
        if (this.finance.id) {
          this.finance = this.getStorableFinance(this.finance);
          this.financesService
            .update(this.finance.id, this.finance)
            .then((response) => {
              this.finances[this.findIndexById(response.data.id)] =
                this.getDisplayableFinance(response.data);
              this.$toast.add({
                severity: "success",
                summary: "Successful",
                detail: "Finance Updated",
                life: 3000,
              });
              console.log(response);
            });
        } else {
          this.finance.id = 0;
          this.finance = this.getStorableFinance(this.finance);
          this.financesService.create(this.finance).then((response) => {
            this.finance = this.getDisplayableFinance(response.data);
            this.finances.push(this.finance);
            this.$toast.add({
              severity: "success",
              summary: "Successful",
              detail: "Finance Created",
              life: 3000,
            });
            console.log(response);
          });
        }
      }
      this.financeDialog = false;
      this.finance = {};
    },
    editFinance(finance) {
      this.finance = { ...finance };
      this.financeDialog = true;
    },
    confirmDeleteFinance(finance) {
      this.finance = finance;
      this.deleteFinanceDialog = true;
    },
    deleteMachine() {
      this.financesService.delete(this.finance.id).then((response) => {
        this.finances = this.finances.filter((t) => t.id !== this.finance.id);
        this.deleteFinanceDialog = false;
        this.finance = {};
        this.$toast.add({
          severity: "success",
          summary: "Successful",
          detail: "Finance Deleted",
          life: 3000,
        });
        console.log(response);
      });
    },
    exportToCSV() {
      this.$refs.dt.exportCSV();
    },
    confirmDeleteSelected() {
      this.deleteFinancesDialog = true;
    },
    deleteSelectedFinances() {
      this.selectedFinances.forEach((finance) => {
        this.financesService.delete(finance.id).then((response) => {
          this.finances = this.finances.filter((t) => t.id !== this.finance.id);
          console.log(response);
        });
      });
      this.deleteFinancesDialog = false;
    },
    formatCurrency(value) {
      return value.toLocaleString("en-US", {
        style: "currency",
        currency: "PEN",
      });
    },
  },
  computed: {
    SpentTotal() {
      let total = 0;
      for(let finance of this.finances){
        if(finance.status=="Spent"){
          total+=finance.quantity;
        }
      }
      return this.formatCurrency(total);
    },
    IncomeTotal() {
      let total = 0;
      for(let finance of this.finances){
        if(finance.status=="Income"){
          total+=finance.quantity;
        }
      }
      return this.formatCurrency(total);
    },
  }
};
</script>

<style scoped></style>
