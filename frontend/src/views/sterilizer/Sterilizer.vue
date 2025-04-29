<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
				</ion-buttons>
				<ion-title>Sterilizer</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-title class="ion-text-center ion-margin">Sterilizer </ion-title>

		<!-- input -->
		<ion-card class="rounded-xl m-2 pb-14"> 
		<div class="input-container m-4">
			<div class=" flex justify-center">
				<p class="py-5 text-sm">{{t('sterilizer.date_select')}}</p>
				<ion-datetime-button class="ion-padding " datetime="date"></ion-datetime-button>
				<ion-modal :keep-contents-mounted="true">
					<ion-datetime :locale="getLocal()" presentation="date" id="date" :multiple="true" v-model="dateValue"></ion-datetime>
				</ion-modal>
			</div>
				<div class=" flex justify-center space-x-5">				
					<ion-select class="py-2 w-92 max-sm:w-40" aria-label="Doctype" v-model="doctypeSelector" interface="popover" :placeholder="t('basket.doctype_select')" fill="outline"
					@ionChange="closePopover"
					@ionCancel="closePopover"
					@ionDismiss="closePopover"
					>
						<ion-select-option v-for="order in workOrderList" 
						:key="order.id "
						:value="`${order.doc_name}|${order.work_order}`">
						{{ order.work_order }}
						</ion-select-option>
					</ion-select>
					<!-- Product Book-->
					<ion-select class="py-2 w-92 max-sm:w-40" aria-label="Doctype" v-model="sterilizerSelector" interface="popover" :placeholder="t('sterilizer.sterilizer_select')" fill="outline"
					@ionChange="closePopover"
					@ionCancel="closePopover"
					@ionDismiss="closePopover"
					>
						<ion-select-option v-for="ster in sterilizerList" 
						:key="ster.id "
						:value="ster.name">
						{{ ster.name }}
						</ion-select-option>
					</ion-select>
				</div>
				<div class=" flex justify-center">
					<ion-button id="select-code" class =" w-dvw h-9 py-2 mt-4 mb-4 max-[412px]:text-[12px]">
						{{ t('sterilizer.sterilizer_items')}} {{ selectCodeText }}
					</ion-button>			
				</div>
				<ion-modal class="ion-padding" trigger="select-code" ref="modal">
					<app-typeahead
					:items="formattedBasketItems"
					:selected-items="selectCode"
        			:title= "t('pallets.select_code')"
					@selection-cancel="modal.$el.dismiss()"
        			@selection-change="updateSelectedCodes"
						>
					</app-typeahead>
				</ion-modal>
		</div>	
		<div class="ion-text-center " v-if="displaySterilizer">
			<p>{{ t('labels.update_success') }}</p>
		</div>
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
			  class="rounded-xl text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
			  @click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-xl  text-white  hover:bg-red-800 bg-red-700 w-20"
			:variant="'solid'"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>

		</ion-card>
		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { IonPage,IonContent,IonHeader,IonToolbar,IonBackButton,
IonButtons,IonTitle,IonButton,
IonSelect,IonSelectOption,
IonDatetimeButton,IonDatetime,IonModal,
IonCard,alertController
} 
from "@ionic/vue";

import { ref, watch, onMounted, computed} from "vue";
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import AppTypeahead from "@/components/AppTypeahead.vue";
import { frappeSDK } from "@/utils/frappeSDK";
const { t } = useI18n()
const router = useRouter()
const { db, call } = frappeSDK()

let displaySterilizer = ref<any>(null)
const basketList = ref<any>([])
const workOrderList = ref<any>([])
const basketTable = ref<any>([])
const dateValue = ref<any>(null)
const doctypeSelector = ref<any>(workOrderList.value[0] || "|")
const sterilizerList = ref<any>([])
const sterilizerSelector = ref<any>(sterilizerList.value[0])
const sterilizerUpdate = ref<any>([])
const modal = ref();
const selectCode = ref<string[]>([]);
const selectCodeText = computed(() => `${selectCode.value.length} ${t('labels.items')}`);

//functions
const alertButtons = [
    {
      text: t('button.Ok'),
      cssClass: 'alert-button-confirm',
    }
  ];
const alertWarning = async () => {
	const alert = await alertController.create({
		cssClass: 'custom_alert',
		header: t('labels.warning'),
		message: t('labels.fix'),
		buttons: alertButtons,
	});
	await alert.present();
};
const formattedBasketItems = computed(() => {
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|")
	const items = basketTable.value
	.filter((item:any) => item.item_code === selectWorkOrder && item.is_sterilized === 0) 
	.map((item:any, index:any )=> ({
		value: `${item.item_code}-${index}`,
		text: `${t('labels.baskets_no')} ${item.basket_no} ${item.item_code} ${t('labels.amount')} ${item.qty} 
		${t('labels.date_of')} ${item.posting_date || 'N/A'}`,
	}));
	//console.log("Work Order", selectWorkOrder)
	//console.log('Formatted items filtered by is_palletized and is_sterilized = 0 :', items);
	return items;
});

//update selected codes
const updateSelectedCodes = async (selectedValues: string[]) => {
	selectCode.value = selectedValues;
	console.log("Selected Codes:", selectCode.value);

	const selectedItems = selectedValues.map((code) => {
	const match = code.match(/^(.+)-(\d+)$/); //regex to extract the baskets and index
	return match ? { item_code: match[1], index: parseInt(match[2]) } : null;
	}).filter(Boolean);

	try {
		const basketsData = selectedItems.map(({ item_code, index }:any) => {
		const filtered = basketTable.value.filter((it:any) => it.item_code === item_code && it.is_sterilized === 0);
		const item = filtered[index];
		return item ? {
			name: item.name,
			basket_month: item.basket_month,
			basket_no: item.basket_no,
			from_time: item.from_time,
			time_in_mins: item.time_in_mins,
			to_time: item.to_time,
			item_code: item.item_code,
			manufacturer: item.manufacturer,
			manufacturer_part_no: item.manufacturer_part_no,
			batch_no: item.batch_no,
			qty: item.qty,
			palletized_qty: item.palletized_qty,
			is_palletized: item.is_palletized,
			is_sterilized: 1,
			sterilizer_no: sterilizerSelector.value,
			posting_date: item.posting_date,
			net_qty: item.net_qty || item.qty,
			available_qty: item.available_qty || item.qty, 
			oneday: item.oneday,
			incubate: item.incubate,
			it: item.it,
			sample: item.sample,
			spoil: item.spoil,
			leak: item.leak,
		} : null;
		}).filter(Boolean);
		sterilizerUpdate.value = basketsData
		console.log("Sterilizer To Update :", sterilizerUpdate.value)
	} catch (error) {
		console.error("Error creating pallets:", error);
	}
	modal.value?.$el.dismiss();

	};

const selectDoctype = async (doctype?: string) => {
	const getBasket = await db.getDocList('Basket Entry',{
		fields: ['name', 'item', 'creation','posting_date'],
		limit: 100, 
		filters: [['posting_date', 'between', getDate.value]],
		orderBy: { field: 'posting_date',order: 'desc',} 
 	})
  
	//map to full doctype to get child table data
	basketList.value = await Promise.all(
		getBasket.map(async (doc) => {
		const basketPO = await db.getDoc('Basket Entry', doc.name);
		return {
			name: doc.name,
			item: doc.item,
			posting_date: doc.posting_date,

			//map to work order child table
			work_order: basketPO.work_order
			? basketPO.work_order.map((wo:any) => ({
				work_order: wo.item, // Work Order Item
				doc_name: doc.name, // Basket Entry Doc Name
				}))
			: [],

			//map to basket child table
			baskets: basketPO.baskets
			? basketPO.baskets.map((bk:any) => ({
				basket_month: bk.basket_month,
				basket_no: bk.basket_no, // Baskets No
				item_code: bk.item_code, // Baskets Item Code
				from_time: bk.from_time,
				time_in_mins: bk.time_in_mins,
				to_time: bk.to_time,
				name: bk.name,
				manufacturer: bk.manufacturer,
				manufacturer_part_no: bk.manufacturer_part_no,
				batch_no: bk.batch_no,
				qty: bk.qty, // Baskets qty
				palletized_qty: bk.palletized_qty,
				is_palletized: bk.is_palletized, // Baskets is palletized
				is_sterilized: bk.is_sterilized,
				sterilizer_no: bk.sterilizer_no,
				posting_date: doc.posting_date,
				oneday: bk.oneday,
				incubate: bk.incubate,
				it: bk.it,
				sample: bk.sample,
				spoil: bk.spoil,
				leak: bk.leak,
				doc_name: doc.name, // Basket Entry Doc Name
				}))
			: []
		};
		})
	);

	workOrderList.value = basketList.value.flatMap((doc:any) =>
		doc.work_order.map((wo:any, index:any) => ({
		id: wo.doc_name + `${doc.name}-${index}`,
		work_order: wo.work_order, // Work Order Item
		doc_name: wo.doc_name, // Basket Entry Doc Name
		}))
	);
	//set basketTable data from basket entry child table
	basketTable.value = basketList.value.flatMap((doc:any) =>
		doc.baskets.map((bk:any) => ({
			basket_month: bk.basket_month,
			basket_no: bk.basket_no, // Baskets No
			item_code: bk.item_code, // Baskets Item Code
			from_time: bk.from_time,
			time_in_mins: bk.time_in_mins,
			to_time: bk.to_time,
			manufacturer: bk.manufacturer,
			manufacturer_part_no: bk.manufacturer_part_no,
			name: bk.name,
			batch_no: bk.batch_no,
			qty: bk.qty, // Baskets qty
			palletized_qty: bk.palletized_qty,
			is_palletized: bk.is_palletized, // Baskets is palletized
			is_sterilized: bk.is_sterilized,
			sterilizer_no: bk.sterilizer_no,
			posting_date: doc.posting_date,
			oneday: bk.oneday,
			incubate: bk.incubate,
			it: bk.it,
			sample: bk.sample,
			spoil: bk.spoil,
			leak: bk.leak,
			doc_name: doc.name, // Basket Entry Doc Name
		}))
	
	);
	//console.log("Work Order ", workOrderList.value)
	//console.log("Baskets Table",basketTable.value)
};

//Pressure Steam Sterilizer Doctype
const selectSterilizer = async (doctype?:string) => {
	const getSterilizer = await db.getDocList('Pressure Steam Sterilizer',{
		fields: ['name',],
		limit: 100, 
		//filters: [['item','=',selectWorkOrder]],
		orderBy: { field: 'name',order: 'desc',} 
 	})
	sterilizerList.value = getSterilizer
	console.log("Sterilizer List", sterilizerList.value)
}

//save
const saveData = async () => {
	console.log(sterilizerSelector.value)
	if(sterilizerSelector.value === undefined) {
			alertWarning();
		}
	try {
		const sterilizerName = sterilizerSelector.value
		const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|");
		console.log("Sterilizer Name", sterilizerName)
		const currentBasket = await db.getDoc("Basket Entry", docNameFromSelector);
		const baskets_table = currentBasket.baskets || [];
		sterilizerUpdate.value.forEach((newBasket:any) => {
			const checkBasketUniqueField = baskets_table.findIndex((basket:any) => basket.name === newBasket.name);
			//find unique basket name then change is_strilizer to 1 and add sterilizer no
			if (checkBasketUniqueField >= 0) {
				baskets_table[checkBasketUniqueField] = {
					...baskets_table[checkBasketUniqueField],
					...newBasket, 
					is_sterilized: 1, 
					sterilizer_no: sterilizerName,
				};
			} /*else {
				baskets_table.push({
					...newBasket,
					is_sterilized: 1,
					sterilizer_no: sterilizerName,
				});
			}*/
		});

    console.log("Updated Baskets Table", baskets_table);
	const updateBaskets = db.updateDoc("Basket Entry", docNameFromSelector, {
		baskets: baskets_table,
	});
	displaySterilizer.value = updateBaskets

	} catch (error) {
		console.error("Error saving data:", error);
	}
}

const getDate = computed(() => {
  if (!dateValue.value || dateValue.value.length === 0) {
    const today = new Date().toISOString().split("T")[0];
    return [today, today];
  }

  const sortedDates = dateValue.value.map((date:any) => new Date(date)).sort((a:any, b:any) => a.getTime() - b.getTime());

  const firstDate = sortedDates[0].toISOString().split("T")[0];
  const lastDate = sortedDates[sortedDates.length - 1].toISOString().split("T")[0];

  return [firstDate, lastDate]; // Return as an array for between
});


const getLocal = () => {
	const local = localStorage.getItem('preferredLanguage');
	if (local === 'th') {
		return 'th-TH'
	}
	else {
		return 'en-GB'
	}
}

const closePopover = () => {
  document.querySelectorAll('ion-popover').forEach((popover) => popover.dismiss());
};


//watch and on Mounted
watch(dateValue, (newDate) => {
  if (newDate) {
    selectDoctype();
    getLocal();
	
  }
});
watch(doctypeSelector, (newDoctype) => {
  if (newDoctype) {
	selectSterilizer(newDoctype);
  }
});

onMounted(() => {
  	selectDoctype(doctypeSelector.value);
});
</script>
<style>
  button.alert-button.alert-button-confirm {
    background-color: #007BE0;
    color: var(--ion-color-success-contrast);
  }
  .md button.alert-button.alert-button-confirm {
	border-radius: 0.6rem;
  }
  .alert-title.sc-ion-alert-md {
	text-align: center;
	color: #CC2929;
  }
  ion-alert.custom_alert{
	--backdrop-opacity: 0.7;
	text-align: center;
  }
</style>
