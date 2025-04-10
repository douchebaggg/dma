<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
				</ion-buttons>
				<ion-title>Basket</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<h2 class="ion-text-center ion-margin">{{ t('basket.header')}}</h2>
		<!-- input -->
		
		<ion-card class="rounded-xl m-2 pb-14 border-1 border-zinc-500">
		<div class="input-container m-4">
			<p class="ion-text-center pb-3">{{ t('basket.date_select_header') }}</p>
			<div class=" flex justify-center">
				<p class="py-5 text-sm">{{t('basket.date_select')}}</p>
				<ion-datetime-button class="ion-padding " datetime="date"></ion-datetime-button>
				<ion-modal :keep-contents-mounted="true">
					<ion-datetime :locale="getLocal()" presentation="date" id="date" v-model="dateValue"></ion-datetime>
				</ion-modal>
			</div>
			<ion-select class="py-2" aria-label="Doctype" v-model="doctypeSelector" interface="popover" :placeholder="t('basket.doctype_select')" fill="outline"
              @ionChange="closePopover"
			  @ionCancel="closePopover"
			  @ionDismiss="closePopover"
              >
                <ion-select-option v-for="order in workOrderList" 
				:key="order.doc_name" 
				:value="`${order.doc_name}|${order.work_order}`">
                {{ order.work_order }}
                </ion-select-option>
              </ion-select>

			<form>
			<ion-label>{{ t('labels.baskets_no') }}</ion-label>
			<Input class="rounded-xl py-1" name="startTime" type="number" inputmode="numeric" v-model="basketNo"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-label>{{ t('labels.start_time') }}</ion-label>
			<Input class="rounded-xl py-1" name="startTime" type="time" v-model="startTime"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-label>{{ t('labels.duration') }}</ion-label>
			<Input class="rounded-xl py-1" name="timeInmins" type="number" inputmode="numeric" v-model="timeInMins"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-label>{{ t('labels.end_time') }}</ion-label>
			<Input class="rounded-xl py-1" name="endTime" type="time" v-model="endTime"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-label>{{ t('labels.amount') }}</ion-label>
			<Input class="rounded-xl py-1" name="amount" type="number" v-model="amount" inputmode="numeric"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			</form>
		</div>	
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
				class="rounded-xl text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
				@click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-xl  text-white hover:bg-red-800 bg-red-700 w-20"
			:variant="'solid'"
			@click="clearData()"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>
		</ion-card>
		<div class="ion-text-center " v-if="displayDoctype">
			<h3>{{ t("basket.update_sucess") }}</h3>
			<p>{{ t("basket.doctype") }} <a class="font-semibold text-sky-600 text-lg" href="#" @click="dynamicLink">{{ displayDoctype.name }}</a> {{ t("basket.after") }}</p>
			<p>{{ t("basket.note") }}</p>
			<h4 v-if="displayDoctype?.baskets?.length">{{ t("basket.preview") }}</h4>
		
		<ion-grid class="m-2 border-1 bg-[#171717] text-white" v-if="displayDoctype?.baskets?.length">
			<ion-row class="font-semibold border-b-1">
				<ion-col class="font-semibold border-r-1">{{ t("labels.baskets_no") }}</ion-col>
				<ion-col class=" border-r-1">{{ t("labels.start_time")}}</ion-col>
				<ion-col class="font-semibold border-r-1">{{ t("labels.duration") }}</ion-col>
				<ion-col class="font-semibold border-r-1">{{ t("labels.end_time") }}</ion-col>
				<ion-col class="font-semibold">{{ t("labels.amount") }}</ion-col>
			</ion-row>
			<ion-row  v-for="(row, index) in paginatedBaskets" :key="index">
				<ion-col class="border-r-1">{{ row.basket_no }}</ion-col>
				<ion-col class="border-r-1">{{ row.from_time }}</ion-col>
				<ion-col class="border-r-1">{{ row.to_time }}</ion-col>
				<ion-col class="border-r-1">{{ row.time_in_mins }} min</ion-col>
				<ion-col>{{ row.qty }}</ion-col>
			</ion-row>
      </ion-grid>
	  <div class="flex justify-center space-x-5 ion-margin-top ion-padding-bottom" v-if="displayDoctype?.baskets?.length > rowsPerPage">
			<Button 
        		class="rounded-xl text-white bg-[#171717] w-14 h-4"
        		:variant="'solid'"
        		:disabled="currentPage === 1"
        		@click="firstPage"
        		size="sm"> {{ t("pagination.first") }} </Button>
      		<Button 
        		class="rounded-xl text-white bg-[#171717] w-12 h-4"
        		:variant="'solid'"
        		:disabled="currentPage === 1"
        		@click="previousPage"
        		size="sm"> < </Button>
      		<span class="">{{ t("pagination.page") }} {{ currentPage }} / {{ totalPages }}</span>
      		<Button 
        		class="rounded-xl text-white bg-[#171717] w-12 h-4"
        		:variant="'solid'"
        		:disabled="currentPage === totalPages"
        		@click="nextPage"
        		size="sm"> > </Button>
			<Button 
        		class="rounded-xl text-white bg-[#171717] w-14 h-4"
        		:variant="'solid'"
        		:disabled="currentPage === totalPages"
        		@click="lastPage"
        		size="sm"> {{ t("pagination.last") }} </Button>
    	</div>

		</div>
		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed} from "vue";
import { IonPage,IonContent,IonHeader,
IonToolbar,
IonBackButton,IonButtons,
IonTitle,
IonRow,IonGrid,IonCol, 
IonSelect,IonSelectOption,
IonDatetime, IonDatetimeButton,
IonModal,IonCard,IonLabel
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { frappeSDK } from "@/utils/frappeSDK";
const { t } = useI18n();
const startTime = ref<string>('')
const timeInMins = ref<number | any>('')
const endTime = ref<string>('')
const amount = ref<number | any>('')
const basketNo = ref<number | any>('')
const dateValue = ref<any>(null)
const router = useRouter()
const { db } = frappeSDK()
let displayDoctype = ref<any>(null)
const basketList = ref<any>([])
const workOrderList = ref<any>([])
const doctypeSelector = ref(workOrderList.value[0]);
const rowsPerPage = 5;
const currentPage = ref(1);

const timeCalculate = (): void => {
  if (!startTime.value || !timeInMins.value) {
    endTime.value = ''; 
    return;
  }
  const [hours, minutes] = startTime.value.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    endTime.value = '';
    return;
  }
  const startDateTime = new Date();
  startDateTime.setHours(hours);
  startDateTime.setMinutes(minutes);
  startDateTime.setMinutes(startDateTime.getMinutes() + parseInt(timeInMins.value));

  const endHours = startDateTime.getHours().toString().padStart(2, '0');
  const endMinutes = startDateTime.getMinutes().toString().padStart(2, '0');

  endTime.value = `${endHours}:${endMinutes}`;
};
  watch([startTime, timeInMins], timeCalculate);

const selectDoctype = async (doctype?: string) => {
	const getBasket = await db.getDocList('Basket Entry',{
		fields: ['name', 'item', 'creation',],
		limit: 10, 
    	filters: [['posting_date','=',getDate.value]],
		orderBy: { field: 'modified',order: 'desc',} 
  })

  //map to full doctype to get child table data
  basketList.value = await Promise.all(
    getBasket.map(async (doc) => {
      const basketPO = await db.getDoc('Basket Entry', doc.name);
      return {
        name: doc.name,
        item: doc.item,
		work_order: basketPO.work_order
          ? basketPO.work_order.map((wo:any) => ({
              work_order: wo.item,  // Work Order Item
              doc_name: doc.name, // Basket Entry Doc Name
            }))
          : [],
      };
    })
  );
  workOrderList.value = basketList.value.flatMap((doc:any) =>
    doc.work_order.map((wo:any) => ({
      work_order: wo.work_order, // Work Order Item
      doc_name: wo.doc_name, // Basket Entry Doc Name
    }))
  );
  //console.log("Basket List ",basketList.value)
  console.log("Work Order List ",workOrderList.value)
  //console.log("Doctype Selector ",doctypeSelector.value)
  if(basketList.value.length > 0){
	console.log("List of ", doctype, " Basket Entry for today" )
  }
  else {
	console.log(getDate.value, "No Basket Entry for selected day")
  }
};

const closePopover = () => {
  document.querySelectorAll('ion-popover').forEach((popover) => popover.dismiss());
};
const getDate = computed(() => {
	if(dateValue.value === undefined ){ 
		const today = new Date().toISOString().split("T")[0];
		return today;
	}
	else {
		return dateValue.value ? dateValue.value.split("T")[0] : "";
	}

});

watch(dateValue, (newDate) => {
  if (newDate) {
    selectDoctype();
    getLocal();
  }
});
onMounted(() => {
  selectDoctype();
  getLocal();
});

const saveData = async () => {
  // Create the doctype
  try {
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|");
	const currentDoc = await db.getDoc("Basket Entry", docNameFromSelector);
	const baskets_table = currentDoc.baskets || [];

	const latestBasketNo = baskets_table.length > 0 
      ? Math.max(...baskets_table.map((basket:any)=> basket.basket_no)) + 1 
      : 1; 

    const newBasketNo = basketNo.value ? parseInt(basketNo.value) : latestBasketNo;
    baskets_table.push({
      basket_no: newBasketNo,
      from_time: startTime.value,
      time_in_mins: timeInMins.value,
      qty: amount.value,
      to_time: endTime.value,
	  item_code: selectWorkOrder
    });
    const doc = await db.updateDoc("Basket Entry", docNameFromSelector, {
		baskets: baskets_table,
    });

    displayDoctype.value = doc; // Set response to be displayed
	currentPage.value = 1;
	console.log("docname is ", docNameFromSelector)
	console.log(displayDoctype.value)
  } catch (error) {
    console.error(error);
  }
};

const clearData = () => {
	startTime.value = ''
	timeInMins.value = ''
	endTime.value = ''
	amount.value = ''
	basketNo.value = ''
}
const getLocal = () => {
	const local = localStorage.getItem('preferredLanguage');
	if (local === 'th') {
		return 'th-TH'
	}
	else {
		return 'en-GB'
	}
}

//pagination
const paginatedBaskets = computed(() => {
  if (!displayDoctype.value?.baskets) return [];
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return displayDoctype.value.baskets.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(displayDoctype.value?.baskets?.length / rowsPerPage);
});
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
	currentPage.value++;
  }
};
const previousPage = () => {
  if (currentPage.value > 1) {
	currentPage.value--;
  }
};

const firstPage = () => {
  currentPage.value = 1;
};
const lastPage = () => {
  currentPage.value = totalPages.value;
};
const dynamicLink = async () =>{
	//const dynamicValue = `${api}/app/testing-doctype/${displayDoctype.value.name}`;
	//await Browser.open({ url: dynamicValue }); 
}
//if Frappe-js-sdk cannot post 
/*	if(axiosError) {
		fetch(`${api}/api/resource/Testing Doctype`, 
		{
		method: "POST",
		headers:{
			"Authorization": `Bearer ${token}`,  // Use OAuth token instead of CSRF
			"Accept": "application/json",
			"Content-Type": "application/json",

		},
		body: JSON.stringify({
		test_table: [{
			start_times: startTime.value,
			time_in_mins: timeInMins.value,
			end_times: endTime.value,
			amount: amount.value
		}]
		})
	})
	.then((res)=>{
		console.log(res)
	})
	.catch((error)=> {
		console.error(error)
	});
	}
*/
</script>
<style scoped>
ion-datetime-button::part(native) {
  background: #F3F3F3;
  color: #171717;
  font-size: 14px;

}
</style>