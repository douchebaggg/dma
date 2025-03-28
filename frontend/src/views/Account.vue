<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="ion-text-center">{{ t("account.my_account", "My Account") }}</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content :fullscreen="true" :scroll-events="true">
			<div class="flex h-full flex-col justify-between">
				<div v-if="user.data" class="m-6 flex flex-col">
					<Card class="mb-4 rounded-xl">
						<div class="flex items-center justify-center py-5">
							<Avatar
							  	:shape="'square'"
							  	:ref_for="true"
								size="xl"
								class="bg-gray-200 h-24 w-24"
								:image="`${user.data.user_image}?t=${Date.now()}`"
								:label="user.data.full_name"
							/>
						</div>
						<div class="flex-col items-start justify-start ion-margin">
							<Input
								class="rounded-xl py-2"
								:label="t('preferences.language')"
								type="select"
								:options="availableLanguages"
								v-model="locale"
								style="
								padding-left: 1rem;
								outline: none; 
								background-image: none; 
								border: solid 1px grey;
								"
							/>
						</div>
					</Card>
					<Button
						class="rounded-xl ion-margin-top text-white bg-red-600"
              			:variant="'solid'"
						theme="red"
						size="md"
						@click="session.logout.submit()"
						>{{ t("auth.logout") }}</Button>
				</div>
				<div v-else class="m-6 flex flex-col items-center"> 
					<Button
						class="rounded-2xl ion-margin-top text-white bg-red-600 w-full"
              			:variant="'solid'"
						theme="red"
						size="md"
						@click="session.logout.submit()"
						>{{ t("auth.logout") }}</Button>
				</div>
				<footer
					class="flex flex-col items-center justify-center p-4 text-center text-sm text-gray-500"
				>
					<span>ALZO Mobile App</span>
					<span>Version {{ appVersion }}</span>				
				</footer>
			</div>			

		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { inject, watch, onMounted, ref } from "vue"
import { useI18n } from "vue-i18n"
import { Avatar, createResource } from "frappe-ui"
import {
	sessionInjectionKey,
	userResourceInjectionKey,
} from "@/typing/InjectionKeys"
import { userResource } from "../data/user"
import { setDefaultLanguage } from "@/locales/devices"
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from "@ionic/vue"
import { FrappeApp } from "frappe-js-sdk"
import { isLocalNetwork, currentHost, apiPort } from "@/utils/checkIP"
const session = inject(sessionInjectionKey)
const user = inject(userResourceInjectionKey)
const api = isLocalNetwork() ? `http://${currentHost}:${apiPort}` : `http://erp.alzo.io:10580`;
const frappe = new FrappeApp(api) 
const call = frappe.call();
const appVersion = ref(null)
const getApp = async() => {
	const res = await call.get('frappe.api.get_app_version');
	appVersion.value = res.message
}
/*const appVersion = createResource({
	url: "http://erp.alzo.io:10580/api/method/dma.api.get_app_version",
	auto: true,
})*/

const { t, locale } = useI18n()
const availableLanguages = [
	{ label: "English", value: "en" },
	{ label: "ไทย", value: "th" },
]
watch(locale, (newLocale) => {
	localStorage.setItem("preferredLanguage", newLocale)
})

onMounted(() => {
	setDefaultLanguage();
	refreshUser();
	getApp();
})

const refreshUser = async () => {
	if(user.data.first_name === ""){
		await userResource.reload()
		user.data = userResource.data
	}
}

</script>
