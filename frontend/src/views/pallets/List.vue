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
			<ion-title class="ion-text-center ion-margin">รายละเอียด Pallets </ion-title>

		<!-- input -->
		<Card class="rounded-xl m-2 pb-14"> 
		<div class="input-container m-4">
			<form>
			<Input class="rounded-xl py-1"  :label="t('labels.pallet_no')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.code')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.nums_of_times')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.invoice_no')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.product_name')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.volume_no')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.size')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1"  :label="t('labels.pallet_doc')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			</form>
		</div>	
		<div class="m-4">
			<ion-title class="ion-text-center">เวลาเรียง</ion-title>
			<Input class="rounded-xl py-1" type="time"  :label="t('labels.start_time')"               
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" type="time"  :label="t('labels.end_time')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
		</div>
		<div class="flex justify-center space-x-5 ion-margin-top">
			<Button 
			  class="rounded-xl text-white bg-[#171717] w-20"
              :variant="'solid'"
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
import { IonPage,IonContent,IonHeader,IonToolbar,IonBackButton,IonButtons,IonTitle,IonButton,IonInput } from "@ionic/vue";
import { useRouter } from "vue-router"
const router = useRouter()
import { useI18n } from "vue-i18n"
const { t } = useI18n()
</script>
<style scoped>
ion-input{
	margin-top: 20px
}
</style>