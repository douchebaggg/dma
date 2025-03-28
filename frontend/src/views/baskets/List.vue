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
			<h2 class="ion-text-center ion-margin">Basket Entry</h2>
		<!-- input -->
		
		<Card class="rounded-xl m-2 pb-14">
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
                <ion-select-option v-for="doctype in basketList" :key="doctype" :value="doctype">
                  {{ doctype }}
                </ion-select-option>
              </ion-select>

			<form>
			<Input class="rounded-xl py-1" name="startTime" type="time" :label="t('labels.start_time')" v-model="startTime"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" name="timeInmins" type="number" :label="t('labels.duration')" inputmode="numeric" v-model="timeInMins"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" name="endTime" type="time" :label="t('labels.end_time')" v-model="endTime"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" name="amount" type="number" :label="t('labels.amount')" v-model="amount" inputmode="numeric"
				style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			</form>
		</div>	
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
				class="rounded-xl text-white bg-[#171717] w-20"
              :variant="'solid'"
				@click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-xl  text-white bg-red-600 w-20"
			:variant="'solid'"
			@click="clearData()"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>
		</Card>
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
			<ion-row  v-for="(row, index) in displayDoctype.baskets" :key="index">
				<ion-col class="border-r-1">{{ row.basket_no }}</ion-col>
				<ion-col class="border-r-1">{{ row.from_time }}</ion-col>
				<ion-col class="border-r-1">{{ row.to_time }}</ion-col>
				<ion-col class="border-r-1">{{ row.time_in_mins }} min</ion-col>
				<ion-col>{{ row.qty }}</ion-col>
			</ion-row>
      </ion-grid>
		</div>
		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed} from "vue";
import { IonPage,IonContent,IonHeader,IonLabel,
IonToolbar,
IonBackButton,IonButtons,
IonTitle,
IonRow,IonGrid,IonCol, 
IonSelect,IonSelectOption,
IonDatetime, IonDatetimeButton,
IonModal
} from "@ionic/vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { FrappeApp } from "frappe-js-sdk";

const { t } = useI18n();
const startTime = ref<string>('')
const timeInMins = ref<number | any>('')
const endTime = ref<string>('')
const amount = ref<number | any>('')
const dateValue = ref(null)
const router = useRouter()
const api = `http://192.168.10.105/`
const frappe = new FrappeApp (api);
const db = frappe.db()
let displayDoctype = ref(null)
const basketList = ref([])
const doctypeSelector = ref(basketList.value[0]);
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

const selectDoctype = async (doctype: string) => {
	const getBasket = await db.getDocList('Basket Entry',{
		fields: ['name', 'creation'],
		limit: 10, 
    	filters: [['posting_date','=',getDate.value]],
		orderBy: { field: 'modified',order: 'desc',} 
  })
  basketList.value = getBasket.map(doc => doc.name)
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
watch([doctypeSelector,dateValue], (newDoctype:any) => {
	if(newDoctype){
		selectDoctype(newDoctype);
		getLocal();
	}
	else {
		selectDoctype(doctypeSelector.value);
		getLocal();
	}
});

onMounted(() => {
  	selectDoctype(doctypeSelector.value);
});

const saveData = async () => {
  // Create the doctype
  try {
	const currentDoc = await db.getDoc("Basket Entry", doctypeSelector.value);
	const baskets_table = currentDoc.baskets || [];
	const basketNo = baskets_table.length + 1;
    baskets_table.push({
		basket_no: basketNo,
		from_time: startTime.value,
		time_in_mins: timeInMins.value,
		qty: amount.value,
		to_time: endTime.value,
    });

    const doc = await db.updateDoc("Basket Entry", doctypeSelector.value, {
		baskets: baskets_table,
    });

    displayDoctype.value = doc; // Set response to be displayed
	console.log("docname is ", doctypeSelector.value)
	console.log(displayDoctype.value)
  } catch (error) {
    console.error(error);
  }
};
const dynamicLink = async () =>{
	const dynamicValue = `${api}/app/testing-doctype/${displayDoctype.value.name}`;
	//await Browser.open({ url: dynamicValue }); 
}

const clearData = () => {
	startTime.value = ''
	timeInMins.value = ''
	endTime.value = ''
	amount.value = ''
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