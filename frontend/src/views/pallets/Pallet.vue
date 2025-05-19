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
					<ion-select class="py-2 w-92 max-sm:w-full" aria-label="Doctype" v-model="doctypeSelector" interface="popover" :placeholder="t('basket.doctype_select')" fill="outline"
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
					<ion-select class="py-2 w-92 max-sm:w-full" aria-label="Doctype" v-model="productBookSelector" interface="popover" :placeholder="t('basket.product_book_select')" fill="outline"
					@ionChange="closePopover"
					@ionCancel="closePopover"
					@ionDismiss="closePopover"
					>
						<ion-select-option v-for="book in productBookList" 
						:key="book.id "
						:value="`${book.name}|${book.size}|${book.book_to}`">
						{{ book.name }} / {{ book.book_to }}
						</ion-select-option>
					</ion-select>
					<ion-input 
					class="py-2 w-92 mt-2 max-sm:w-full" 
					fill="outline" type="number" 
					inputmode="numeric" :label="t('pallets.size')" label-placement="stacked"
					v-model="size"></ion-input>
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
					:initial-inputs="storedInputs"
					@selection-cancel="modal.$el.dismiss()"
        			@selection-change="updateSelectedCodes"
					@input-change="handleInputChange"
					>
					</app-typeahead>
				</ion-modal>
		</div>	
		<div class="ion-text-center " v-if="displayPallet">
		<ion-grid class="m-4 border-1 bg-[#171717] text-white" v-if="displayPallet.palletized_products?.length">
			<ion-row class="font-semibold border-b-1">
				<ion-col class="font-semibold border-r-1">{{ t("pallets.pallet_seq") }}</ion-col>
				<ion-col class=" border-r-1">{{ t("pallets.pallet_no")}}</ion-col>
				<ion-col class=" border-r-1">{{ t("pallets.code")}}</ion-col>
				<ion-col class="font-semibold border-r-1">{{ t("pallets.product_name") }}</ion-col>
				<ion-col class="font-semibold border-r-1">#{{ t("pallets.hash_pallet") }}</ion-col>
				<ion-col class="font-semibold">{{ t("pallets.pallet_qty") }}</ion-col>
			</ion-row>
			<ion-row  v-for="(row, index) in paginatedPallet" :key="index">
				<ion-col class="border-r-1">{{ row.pallet_seq }}</ion-col>
				<ion-col class="border-r-1">{{ row.pallet_no }}</ion-col>
				<ion-col class="border-r-1">{{ row.item_code }}</ion-col>
				<ion-col class="border-r-1">{{ row.item_name }}</ion-col>
				<ion-col class="border-r-1">{{ row.size }}</ion-col>
				<ion-col>{{ row.qty }}</ion-col>
			</ion-row>
      </ion-grid>
	  <div class="flex justify-center space-x-5 ion-margin-top ion-padding-bottom" v-if="displayPallet.palletized_products?.length > rowsPerPage">
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
		<div class="m-4 flex flex-col">
			<ion-title class="ion-text-center">{{ t('pallets.time') }}</ion-title>
			<ion-label>{{ t('pallets.start') }}</ion-label>
			<Input class="rounded-xl py-1" type="time" v-model="fromTime"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-label>{{ t('pallets.minute') }}</ion-label>
			<Input class="rounded-xl py-1" inputmode="numeric" v-model="timeInMins"
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<ion-checkbox class="py-1" label-placement="end" v-model="isHold">{{ t('pallets.hold') }}</ion-checkbox>
			<ion-textarea class="rounded-xl py-1 h-20 mb-2" :label="t('pallets.reason')" fill="outline" v-if="isHold"
			  label-placement="stacked" v-model="holdReason">
			</ion-textarea>
			<ion-checkbox class="py-1" label-placement="end" v-model="isFull">{{ t('pallets.full') }}</ion-checkbox>
		</div>
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
			  class="rounded-xl text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
			  @click="saveData"
              size="md"> {{ t("button.Save") }}</Button>

			<Button
			class="rounded-xl text-white hover:bg-red-800 bg-red-700 w-20"
			:variant="'solid'"
			size="md" >{{ t("button.Cancel") }}</Button>
		</div>

		</ion-card>

		</ion-content>
	</ion-page>
	
</template>

<script setup lang="ts">
import { IonPage,IonContent,IonHeader,IonToolbar,IonBackButton,
IonButtons,IonTitle,IonButton,IonTextarea,IonInput,IonLabel,
IonDatetime, IonDatetimeButton,
IonSelect,IonSelectOption,IonCheckbox,
IonModal,IonGrid,IonRow,IonCol,toastController,IonCard
} from "@ionic/vue";
import { ref, watch, onMounted, computed} from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { frappeSDK } from "@/utils/frappeSDK";
import AppTypeahead from "@/components/AppTypeaheadCustom.vue";
const router = useRouter();
const { t } = useI18n();
const { db, call } = frappeSDK();
let displayPallet = ref<any>([]);
const basketList = ref<any>([]);
const workOrderList = ref<any>([]);
const basketTable = ref<any>([]);
const dateValue = ref<any>(null);
const doctypeSelector = ref<any>(workOrderList.value[0]);
const productBookList = ref<any>([]);
const productBookSelector = ref(productBookList.value[0]);
const basketToPalletized = ref<any>([]);
const selectCodeText = computed(() => `${selectCode.value.length} ${t('labels.items')}`);
const modal = ref();
const selectCode = ref<string[]>([]);
const rowsPerPage = 5;
const currentPage = ref(1);
const isHold = ref(false);
const holdReason = ref("");
const isFull = ref(false);
const fromTime = ref("");
const timeInMins = ref(0);
let size = ref<number>(0)
const storedInputs = ref<{
  [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number };
}>({});

const formattedBasketItems = computed(() => {
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|")
	const items = basketTable.value
	.filter((item:any) => item.is_palletized === 0 && item.item_code === selectWorkOrder) 
	.map((item:any, index:number )=> ({
		value: `${item.item_code}-${index}`,
		text: `${t('labels.baskets_no')} ${item.basket_no} ${t('pallets.pallet_qty')} ${item.qty} 
		${t('labels.date_of')} ${item.posting_date || 'N/A'}`,
	}));
	//console.log('Formatted items filtered by is_palletized = 0 :', items);
	return items;
});

const updateSelectedCodes = async (payload: {
  selected: string[];
  inputs: { [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number } };
}) => {
	selectCode.value = payload.selected;
	console.log("Selected Codes:", selectCode.value);
	storedInputs.value = payload.inputs;
	console.log("Stored Inputs:", storedInputs.value);
	const [productBookName, productBookSize, productBookTo] = productBookSelector.value.split("|")
	const selectedItems = payload.selected.map((code) => {
	const match = code.match(/^(.+)-(\d+)$/); //regex to extract the baskets and index
	return match ? { item_code: match[1], index: parseInt(match[2]) } : null;
	}).filter(Boolean);
	console.log("Product Book size", productBookSize);
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|");
	const currentPalletSeq = await call.get('thai.thai.doctype.palletizing_entry.palletizing_entry.get_current_pallet_seq', {
    item: selectWorkOrder,
	});
	const lastBookNo = await call.get('thai.thai.doctype.palletizing_entry.palletizing_entry.get_last_book_no', {
    book_no: productBookName,
	});
	const newBookNo = parseInt(lastBookNo.message) + 1;
	let pallet_seq = currentPalletSeq.message + 1;
	console.log("Pallet seq ", pallet_seq, "New Book no", newBookNo)
	try {
		const basketsData = selectedItems.map(({ item_code, index }:any, idx) => {
		const filtered = basketTable.value.filter((it:any) => it.item_code === item_code && it.is_palletized === 0);
		const code = payload.selected[idx]; // Get the original code (e.g., "item1-0") from payload.selected
     	const inputValues = storedInputs.value[code]
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
			manufacturer_part_no: item.manufacturer_part_no || "None",
			batch_no: item.batch_no || "None",
			qty: item.qty,
			palletized_qty: item.palletized_qty,
			posting_date: item.posting_date,
			net_qty: item.net_qty || item.qty,
			available_qty: item.available_qty,
			is_full: 0,
			is_hold: 0, 
			hold_reason: holdReason.value,
			oneday: Number(inputValues.one_day),
			incubate: Number(inputValues.incubate),
			it: Number(inputValues.IT),
			sample: Number(inputValues.example),
			spoil: Number(inputValues.spoil),
			leak: Number(inputValues.leak),
		} : null;
		}).filter(Boolean);
		console.log("Basket Data :", basketsData)
		basketToPalletized.value = basketsData
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
	//set basket data from basket entry child table
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
	//console.log("Baskets Table",)
};

const selectProductBook = async (doctype?:string) => {
	const [docNameFromSelector, selectWorkOrder] = doctypeSelector.value.split("|")
	console.log("Product book for ", selectWorkOrder)
	const getProductBook = await db.getDocList('Product Books',{
		fields: ['name', 'item', 'book_start','book_to','description','size'],
		limit: 100, 
		filters: [['item','=',selectWorkOrder]],
		orderBy: { field: 'modified',order: 'desc',} 
 	})
	productBookList.value = getProductBook
	size = productBookList.value[0].size
}

//save
const saveData = async () => {
	try {
	const getPalletDoctype = await db.getDocList('Palletizing Entry', {
		fields: ['name','manufacturing_from_date','manufacturing_to_date'],
		filters: [["manufacturing_from_date", "between", getDate.value]],
		});
	const palletizingEntry = getPalletDoctype[0];
	console.log("palletizingEntry name", palletizingEntry.name)
	if(isHold.value === true){
		basketToPalletized.value.forEach((basket:any) => {
			basket.is_hold = 1;
			basket.hold_reason = holdReason.value;
		});
	}
	const args = {
			docname: palletizingEntry.name,
			baskets_details: basketToPalletized.value,
			size: Number(size)
		}
	console.log("Args to backend", args)
	const response = await call.post('thai.thai.doctype.palletizing_entry.palletizing_entry.set_required_products_mobile', args)
	console.log("Response from set_required_products", response)
	//get full doctype
	const getCurrentPallet = await db.getDoc('Palletizing Entry', palletizingEntry.name);
	displayPallet.value = getCurrentPallet
	console.log("Display Pallet", displayPallet.value)
	//console.log("Test length", displayPallet.value.length)
	await selectDoctype(); 
	currentPage.value = 1;
	} catch (error:any) {
		presentToast(error.exception || error.message);
		console.error("Error palletized :", error.exception);
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

//pagination
const paginatedPallet = computed(() => {
  if (!displayPallet.value?.palletized_products) return [];
  const start = (currentPage.value - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  return displayPallet.value.palletized_products.slice(start, end);
});
const totalPages = computed(() => {
  return Math.ceil(displayPallet.value?.palletized_products?.length / rowsPerPage);
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

const handleInputChange = (payload: {
  selected: string[];
  inputs: { [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number } };
}) => {
  storedInputs.value = payload.inputs; // Update storedInputs reactively
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
	selectProductBook(newDoctype);
  }
});

watch(
  storedInputs,
  (newInputs) => {
    Object.entries(newInputs).forEach(([code, inputValues]) => {
      const match = code.match(/^(.+)-(\d+)$/);
      if (!match) return;

      const item_code = match[1];
      const index = parseInt(match[2]);
      const filtered = basketTable.value.filter((it:any) => it.item_code === item_code && it.is_palletized === 0);
      const item = filtered[index];
	  console.log("Item", item)
      if (!item) return;

      const originalQty = item.net_qty || item.qty; 
      const inputCheck = Object.values(inputValues).every(
        (v) => !v && v !== 0 // null, undefined 
      );
      let available_qty = originalQty;
      let new_value = 0;
	  let palletized_qty = 0;
      if (!inputCheck) {
        
        new_value =
          Number(inputValues.one_day || 0) +
          Number(inputValues.incubate || 0) +
          Number(inputValues.IT || 0) +
          Number(inputValues.example || 0) +
          Number(inputValues.spoil || 0) +
          Number(inputValues.leak || 0);

        available_qty = originalQty - new_value; 
		palletized_qty = originalQty - new_value;
      }
      basketTable.value = basketTable.value.map((bt:any) =>
        bt.name === item.name && bt.doc_name === item.doc_name
          ? {
              ...bt,
              qty: available_qty, 
              available_qty, 
              net_qty: originalQty,
			  palletized_qty 
            }
          : bt
      );
    });
  },
  { deep: true }
);

//toast
const presentToast = async (message: string) => {
    const toast = await toastController.create({
        message,
        duration: 5000,
        position: "bottom",
        color: "danger",
    });
    await toast.present();
};

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
#select-code:hover{
	cursor: pointer;
}
ion-checkbox::part(container) {
    border-radius: 4px;
    border: 1px solid #171717;
  }
</style>