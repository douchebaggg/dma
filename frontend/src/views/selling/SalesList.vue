<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
				</ion-buttons>
				<ion-title>Sale</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<ion-title class="ion-text-center ion-margin">Selling Doctype</ion-title>
            <SaleDoctype class="mt-18" />
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
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { frappeSDK } from "@/utils/frappeSDK";
import SaleDoctype from "./SaleDoctype.vue";
const { t } = useI18n()
const router = useRouter()
</script>

