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
				<p class="py-5 text-sm">{{t('pallets.date_select')}}</p>
				<ion-datetime-button class="ion-padding " datetime="date"></ion-datetime-button>
				<ion-modal :keep-contents-mounted="true">
					<ion-datetime :locale="getLocal()" presentation="date" id="date" :multiple="true" v-model="dateValue"></ion-datetime>
				</ion-modal>
			</div>
				<div class=" flex justify-center space-x-5 max-sm:flex-col">				
					<ion-select class="py-2 mt-3 w-92 max-sm:w-full" aria-label="Doctype" v-model="doctypeSelector" interface="popover" :placeholder="t('basket.doctype_select')" fill="outline"
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
					<ion-select class="py-2 w-92 mt-3 max-sm:w-full" aria-label="Doctype" v-model="sterilizerSelector" interface="popover" :placeholder="t('sterilizer.sterilizer_select')" fill="outline"
					@ionChange="closePopover"
					@ionCancel="closePopover"
					@ionDismiss="closePopover"
					>
						<ion-select-option v-for="ster in sterilizerList" 
						:key="ster.id "
						:value="`${ster.name}`">
						{{ ster.name }}
						</ion-select-option>
					</ion-select>
					<ion-select class="custom-select py-2 w-92 mt-3 max-sm:w-full" aria-label="Doctype" 
					interface="action-sheet"
					:cancel-text="t('button.Cancel')"
					:placeholder="t('sterilizer.round')" 
					:interface-options="customActionSheet"
					v-model="roundSelector"
					fill="outline">
					<ion-select-option v-for="round in roundList" 
						:key="round.id "
						:value="round.value">
						{{ round.name }}
						</ion-select-option>
					</ion-select>
				</div>
				<div class=" flex justify-center">
					<ion-button id="select-code" class =" w-dvw py-2 mt-4 mb-4 max-sm:text-sm">
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
			  class="rounded-lg text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
			  @click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-lg text-white hover:bg-red-800 bg-red-700 w-20"
			:variant="'solid'"
			@click="clearData"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>
		<ion-modal :is-open="showModal" backdrop-dismiss="false" animated="true">
			<LoadingToSuccess 
			v-model="showModal"
			@confirmed="clearData"
			ref="loadingSuccessRef" />
		</ion-modal>

		</ion-card>
		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { IonPage,IonContent,IonHeader,IonToolbar,IonBackButton,IonButtons,IonTitle,IonButton,
IonSelect,IonSelectOption,IonDatetimeButton,IonDatetime,IonModal,IonCard } 
from "@ionic/vue";

import { ref, watch, onMounted, computed} from "vue";
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import AppTypeahead from "@/components/AppTypeahead.vue";
import { frappeSDK } from "@/utils/frappeSDK";
import LoadingToSuccess from "@/components/LoadingToSuccess.vue";
const showModal = ref(false)
const loadingSuccessRef = ref<InstanceType<typeof LoadingToSuccess> | null>(null)
let isSave = ref(false)
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
const roundList = ref<any>([])
const roundSelector = ref(roundList.value[0])
const modal = ref();
const selectCode = ref<string[]>([]);
const selectCodeText = computed(() => `${selectCode.value.length} ${t('labels.items')}`);

roundList.value = [
	{ id: 1, name: "1",value:"01" },
	{ id: 2, name: "2",value:"02" },
	{ id: 3, name: "3",value:"03" },
	{ id: 4, name: "4",value:"04" },
	{ id: 5, name: "5",value:"05" },
	{ id: 6, name: "6",value:"06" },
	{ id: 7, name: "7",value:"07" },
	{ id: 8, name: "8",value:"08" },
	{ id: 9, name: "9",value:"09" },
	{ id: 10, name: "10",value:"10" },
];
const customActionSheet = {
	header: t('sterilizer.round'),
	subHeader: t('sterilizer.select_round'),
};

//functions

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
	console.log('Formatted items filtered is_sterilized = 0 :', items);
	return items;
});

//update selected codes
const updateSelectedCodes = async (selectedValues: string[]) => {
	selectCode.value = selectedValues;
	console.log("Selected Codes:", selectCode.value);

	const selectedItems = selectedValues.map((code) => {
	const match = code.match(/^(.+)-(\d+)$/); //regex to extract the baskets and index
	return match ? { item_code: match[1], index: parseInt(match[2]),} : null;
	}).filter(Boolean);

	try {
		const basketsData = selectedItems.map(({ item_code, index, }:any) => {
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
			sterilizer_no: `${sterilizerSelector.value}/${roundSelector.value}`,
			posting_date: item.posting_date,
			net_qty: item.net_qty || item.qty,
			available_qty: item.available_qty || item.qty, 
			oneday: item.oneday,
			incubate: item.incubate,
			it: item.it,
			sample: item.sample,
			spoil: item.spoil,
			leak: item.leak,
			doc_name: item.doc_name,
		} : null;
		}).filter(Boolean);
		sterilizerUpdate.value = basketsData
		console.log("Sterilizer To Update :", sterilizerUpdate.value)
	} catch (error) {
		console.error("Error creating sterilizer:", error);
	}
	modal.value?.$el.dismiss();

	};

//save
const saveData = async () => {
	try {
		let updateBaskets = ref<any>([])
		const groupedByDocname = sterilizerUpdate.value.reduce((acc: any, item: any) => {
		if (!acc[item.doc_name]) acc[item.doc_name] = [];
		acc[item.doc_name].push(item);
		return acc;
		}, {});

		for (const docname in groupedByDocname) {
		const currentBasket = await db.getDoc("Basket Entry", docname);
		const baskets_table = currentBasket.baskets || [];
		const updates = groupedByDocname[docname];

		updates.forEach((newBasket: any) => {
			const index = baskets_table.findIndex((b:any) => b.name === newBasket.name);
			if (index >= 0) {
			baskets_table[index] = {
				...baskets_table[index],
				...newBasket,
				is_sterilized: 1,
				sterilizer_no: `${sterilizerSelector.value}/${roundSelector.value}`,
			};
			}
		});

		console.log(`Updated Basket Entry [${docname}]`, baskets_table);

		updateBaskets.value = await db.updateDoc("Basket Entry", docname, {
			baskets: baskets_table,
		});
		}
		console.log(updateBaskets.value)
		if(updateBaskets.value.length === 0) {
			console.log("document is not save")
		} else {
			isSave.value = true
		}
		if (isSave.value === true){
			console.log("doctype update success", isSave.value)

			showModal.value = true
			await new Promise((resolve) => setTimeout(resolve, 50))
			loadingSuccessRef.value?.showAnimation()

			setTimeout(() => {
				displaySterilizer.value = updateBaskets.value
			}, 1200)
		}
	} catch (error) {
		console.error("Error saving data:", error);
	}
}
const clearData = () => {
	isSave.value = false
	dateValue.value = getDate.value
	sterilizerSelector.value = sterilizerList.value[0]
	roundSelector.value = roundList.value[0]
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
watch(roundSelector, (val)=>{
	console.log(roundSelector.value)
})
onMounted(() => {
  	selectDoctype(doctypeSelector.value);
});
</script>
<style>
.action-sheet-title.sc-ion-action-sheet-md{
	font-size: 1rem;
	text-align: center;
}
.action-sheet-wrapper.sc-ion-action-sheet-md {
	padding-top: 25dvh;
	width: 75dvw;
	height: 100dvh;
}
.action-sheet-group.sc-ion-action-sheet-md:first-child {
	border-radius: 20px;
	margin-bottom: 15px;
}
.action-sheet-group.sc-ion-action-sheet-md:last-child {
	border-radius: 20px;
}
.action-sheet-button-inner.sc-ion-action-sheet-md {
	justify-content: center;
}
</style>