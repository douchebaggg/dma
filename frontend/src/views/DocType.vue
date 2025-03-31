<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="ion-text-center">รายการเอกสารทั้งหมด</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content
          pulling-text="Pull to refresh"
          refreshing-spinner="dots"
          refreshing-text="Refreshing..."
        >
        </ion-refresher-content>
      </ion-refresher>
        <ListDoctype class="mt-32" />
		</ion-content>

	</ion-page>
</template>
<script lang="ts" setup>
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
  IonList,
  IonButton,
  IonCard,
  IonCardHeader,
  modalController,
  IonRefresher,
  IonRefresherContent,
  IonItem
} from "@ionic/vue"
import { onMounted, ref } from "vue";
//import { RouterLink } from "vue-router";
import DoctypeCreate from "./doctype/DoctypeCreate.vue";
import { urlPort  } from "@/utils/checkIP";
import ListDoctype from "./doctype/ListDoctype.vue";
import { App } from "@capacitor/app"
import { Browser } from "@capacitor/browser";
import { frappeSDK } from "@/utils/frappeSDK";
onMounted(() => {
	getDoctype()
})
const displayDoc = ref(null)
const displayWorkOrder = ref(null)
const { db } = frappeSDK()
const message = ref('');


const getDoctype = async () => {
  const allDoctype = await db.getDocList('Testing Doctype', { 
	fields: ['name', 'creation'],
	limit: 10, 
  //filters: [['name','=','BK202409-012']],
	orderBy: { field: 'modified',order: 'desc',} 
});
  let docNameWithProducts = null;
  for (const doc of allDoctype) {
    const docType = await db.getDoc('Testing Doctype', doc.name);
    if (docType.items && docType.items.length > 0) {
      docNameWithProducts = doc.name;
      displayDoc.value = docType.items;
      //console.log(docType,"\n Success");
    }
    else {
      docNameWithProducts = doc.name;
      displayDoc.value = docType.idx;
      //console.log(docType);
      //console.log(displayDoc.value)
    }
    if(docType.item_code && docType.item_code.length > 0){
      //console.log(docType.item_code)
      displayWorkOrder.value = docType.item_code;
      break;
    } 
  }

  if (!docNameWithProducts) {
    console.log('No document found');
  } else {
    console.log('List all Docname',allDoctype, docNameWithProducts);
  }
};
const handleRefresh = async (event: CustomEvent) => {
  try {
    await getDoctype()
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  } catch (error) {
    console.error("Error refreshing user data:", error);
  }
}
</script>

<style scoped>
.newDoctype{
  margin: auto;
  display: block;

}
ion-card{
  height: 35vh;
  overflow: auto;
  scroll-behavior: smooth;
}
.sticky-header {
  font-size: large;
  position: sticky;
  top: 0;
  z-index: 100; 
  background-color: whitesmoke;
}
.work-order{
  font-size: larger;
}
</style>