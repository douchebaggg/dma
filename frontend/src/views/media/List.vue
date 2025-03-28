<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-buttons slot="start">
					<ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
				</ion-buttons>
				<ion-title>Media</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
			<h2 class="ion-text-center ion-margin">Process Order </h2>

		<!-- input -->
		<Card class="rounded-xl m-2 pb-14"> 
		<div class="input-container m-4">
			<form>
			<Input class="rounded-xl py-1" :label="t('labels.code')"               
			style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" :label="t('labels.product')" 
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" :label="t('labels.material')" 	  
			style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" :label="t('labels.produced')"
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			<Input class="rounded-xl py-1" :label="t('labels.order')"
			  style="outline: none; padding-left: 1rem; border: solid 1px grey;" />
			</form>
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
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const router = useRouter()

</script>
<style scoped>
ion-input{
	margin-top: 20px
}
</style>