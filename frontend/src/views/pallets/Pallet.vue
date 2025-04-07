<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
				</ion-buttons>
				<ion-title>Pallets</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-title class="ion-text-center ion-margin"> {{ t('pallets.header') }} </ion-title>

		<!-- input -->
		<Card class="rounded-xl m-2 pb-14"> 
		<div class="input-container m-4">
			<div class=" flex justify-center">
				<p class="py-5 text-sm">{{t('pallets.date_select')}}</p>
				<ion-datetime-button class="ion-padding " datetime="date"></ion-datetime-button>
				<ion-modal :keep-contents-mounted="true">
					<ion-datetime :locale="getLocal()" presentation="date" id="date" :multiple="true" v-model="dateValue"></ion-datetime>
				</ion-modal>
			</div>
				<div class=" flex justify-center">				
					<ion-select class="py-2" aria-label="Doctype" v-model="doctypeSelector" interface="popover" :placeholder="t('basket.doctype_select')" fill="outline"
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
				</div>
				<div class=" flex justify-center">
					<ion-button id="select-code" class =" w-dvw h-9 py-2">
						{{ t('pallets.doctype_select')}} {{ selectCodeText }}
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

			<!--form>
			<Input class="rounded-xl py-1"  :label="t('pallets.invoice_no')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('pallets.code')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('pallets.product_name')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('pallets.hash_pallet')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			</form-->
			
		</div>	
		<div class="m-4">
			<ion-title class="ion-text-center">{{ t('pallets.time') }}</ion-title>
			<Input class="rounded-xl py-1" type="time"  :label="t('pallets.start')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" type="time"  :label="t('pallets.minute')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
		</div>
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
			  class="rounded-xl text-white bg-[#171717] w-20"
              :variant="'solid'"
			  @click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-xl  text-white  bg-red-600 w-20"
			:variant="'solid'"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>
		</Card>

		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { IonPage,IonContent,IonHeader,IonToolbar,IonBackButton,
IonButtons,IonTitle,IonButton,
IonDatetime, IonDatetimeButton,
IonSelect,IonSelectOption,
IonModal 
} from "@ionic/vue";
import { ref, watch, onMounted, computed} from "vue";
import { useRouter } from "vue-router"
import { useI18n } from "vue-i18n"
import { frappeSDK } from "@/utils/frappeSDK";
import AppTypeahead from "./AppTypeahead.vue";
const router = useRouter()
const { t } = useI18n()
const { db, call } = frappeSDK()

let displayDoctype = ref(null)
const basketList = ref<any>([])
const workOrderList = ref<any>([])
const basketTable = ref<any>([])
const dateValue = ref<any>(null)
const palletList = ref([])
const doctypeSelector = ref<string>(workOrderList.value[0])
const selectCodeText = computed(() => `${selectCode.value.length} Items`);
const modal = ref();
const selectCode = ref<string[]>([]);

const formattedBasketItems = computed(() => {
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|")
	const items = basketTable.value
	.filter((item:any) => item.is_palletized === 0 && item.baskets === selectWorkOrder) 
	.map((item:any, index:number )=> ({
		value: `${item.baskets}-${index}`,
		text: `${t('labels.baskets_no')} ${item.basket_no} ${item.baskets} ${t('labels.amount')} ${item.qty} 
		${t('labels.date_of')} ${item.posting_date || 'N/A'}`,
	}));
	console.log('Formatted items filtered by is_palletized = 0 :', items);
	return items;
	});

const updateSelectedCodes = async (selectedValues: string[]) => {
	selectCode.value = selectedValues;
	console.log("Selected Codes:", selectCode.value);

	const selectedItems = selectedValues.map((code) => {
	const match = code.match(/^(.+)-(\d+)$/); //regex to extract the baskets and index
	return match ? { baskets: match[1], index: parseInt(match[2]) } : null;
	}).filter(Boolean);
	console.log("Selected Items:", selectedItems);

	try {
		const basketsData = selectedItems.filter((item): item is { baskets: string; index: number } => item !== null).map(({ baskets, index }) => {
		const filtered = basketTable.value.filter((it:any) => it.baskets === baskets);
		const item = filtered[index] as any; 
		return item ? {
			basket_month: item.basket_month,
			basket_no: item.basket_no,
			item_code: item.baskets,
			qty: item.qty,
			net_qty: item.net_qty || item.qty,
			available_qty: item.available_qty || item.qty, 
			palletized_qty: item.qty,

		} : null;
		}).filter(Boolean);
		
		console.log("Basket Data :", basketsData)

		const palletizedProducts = basketsData.map((data:any, idx) => ({
			pallet_no: 1200, //test only
			basket_month: data.basket_month,
			item_code: data.item_code,
			item_name: data.item_code,
			basket_no: data.basket_no,
			qty: data.qty,
			net_qty: data.net_qty || data.qty,
			available_qty: data.available_qty || 0, 
			palletized_qty: data.qty,
			size: 200, //test only
			baskets: JSON.stringify([data])
		}));
		console.log("Palletized Products:", palletizedProducts);


		const getPalletDoctype = await db.getDocList('Palletizing Entry', {
		fields: ['name', 'palletized_products','posting_date','palletized_products'],
		filters: [["posting_date", "=", getDate.value[0]]],
		});
		const palletizingEntry = getPalletDoctype[0];
		const currentProducts = palletizingEntry.palletized_products || [];
		const updatedProducts = [...currentProducts, ...palletizedProducts];
		//console.log("Current Products", palletizingEntry.palletized_products)
		await db.updateDoc("Palletizing Entry", palletizingEntry.name, {
			palletized_products: updatedProducts,
		});
		console.log("Updated Products success", updatedProducts)
		//await selectDoctype(); 
		
	} catch (error) {
		console.error("Error creating pallets:", error);
	}
	modal.value?.$el.dismiss();
	};
//get Doctype
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
				baskets: bk.item_code, // Baskets Item Code
				qty: bk.qty, // Baskets qty
				is_palletized: bk.is_palletized, // Baskets is palletized
				posting_date: doc.posting_date,
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
	basketTable.value = basketList.value.flatMap((doc:any) =>
		doc.baskets.map((bk:any) => ({
		basket_month: bk.basket_month,
		basket_no: bk.basket_no, // Baskets No
		baskets: bk.baskets, // Baskets Item Code
		qty: bk.qty, // Baskets qty
		is_palletized: bk.is_palletized, // Baskets is palletized
		posting_date: bk.posting_date,
		doc_name: bk.doc_name, // Basket Entry Doc Name
		}))
	
	);
	//console.log("Work Order ", workOrderList.value)
	//console.log("Baskets Table",)
};

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

//save
const saveData = () => {

}

//watch and on Mounted
watch(dateValue, (newDate) => {
  if (newDate) {
    selectDoctype();
    getLocal();
  }
});

onMounted(() => {
  	selectDoctype(doctypeSelector.value);
});
</script>
<style>
ion-datetime-button::part(native) {
  background: #F3F3F3;
  color: #171717;
  font-size: 14px;

}
.custom-alert .alert-button-group {
  display: flex;
  justify-content: center;
}
#select-code:hover{
	cursor: pointer;
}
</style>