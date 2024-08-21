<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title>Test</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true">
			<h1 class="ion-text-center ion-padding">Hello</h1>
      <div class="ion-text-center ion-padding">
      <ion-button @click="openModal">Create Doctype</ion-button>
    <!--   <RouterLink :to="{ name: 'Doctype Create' }" v-slot="{ href }">
        <ion-button :href="href">Create Doctype</ion-button>
      </RouterLink> --> 

      </div>
      <div class="newDoctype ion-text-center ">
        <p>{{ message }}</p>
      </div>
			<ion-card v-if="displayDoc && displayDoc.length">  
        <ion-card-header class="sticky-header ion-text-center">Doctype</ion-card-header>  
       <ion-list class="ion-padding">
       <ion-item href="#" v-for="product, in displayDoc" :key="product.name"> 
        
           ตะกร้าเลขที่ {{ product.basket_no }} เวลาเริ่ม {{ product.from_time }} เป็นเวลา {{ product.time_in_mins }} นาที สิ้นสุดเวลา {{ product.to_time }}
          </ion-item> 
        </ion-list>
      </ion-card> 
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
  IonItem
} from "@ionic/vue"
import { FrappeApp } from "frappe-js-sdk";
import { onMounted, ref } from "vue";
//import { RouterLink } from "vue-router";
import DoctypeCreate from "./doctype/DoctypeCreate.vue";
onMounted(() => {
	getDoctype()
})
const displayDoc = ref(null)
const frappe = new FrappeApp ('http://192.168.10.105:8001/')
const db = frappe.db()
const message = ref('');
const getDoctype = async () => {
  const allDoctype = await db.getDocList('Basket Entry', { 
	fields: ['name', 'creation'],
	limit: 100, 
	orderBy: { field: 'modified',order: 'desc',} 

});
  
  let docNameWithProducts = null;
  for (const doc of allDoctype) {
    const docType = await db.getDoc('Basket Entry', doc.name);
    if (docType.baskets && docType.baskets.length > 0) {
      docNameWithProducts = doc.name;
      displayDoc.value = docType.baskets;
      console.log(docType);
      break;
    } else {
      console.error("Something Error")
    }
  }

  if (!docNameWithProducts) {
    console.log('No document found');
  } else {
    console.log('List all Docname',allDoctype, docNameWithProducts);
  }
};

const openModal = async () => {
    const modal = await modalController.create({
      component: DoctypeCreate,
    });

    modal.present();

    const { data, role } = await modal.onWillDismiss();

    if (role === 'confirm') {
      message.value = `Doctype, ${data} has create`;
    }
  };
</script>

<style scoped>
.newDoctype{
  margin: auto;
  display: block;

}
ion-card{
  height: 20vh;
  overflow: auto;
  scroll-behavior: smooth;
}
.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100; /* Adjust as needed */
  background-color: whitesmoke;
}
</style>