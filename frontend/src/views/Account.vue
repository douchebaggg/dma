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
					<ion-card class=" rounded-xl border-1 dark: border-zinc-500">
						<div class="flex justify-end ion-margin">
							<ion-icon
								v-if="isDarkMode"
								class="text-2xl cursor-pointer text-yellow-300"
								:icon="moon"
								@click="toggleTheme"
							/>
							<ion-icon
								v-else
								class="text-2xl cursor-pointer text-amber-500"
								:icon="sunny"
								@click="toggleTheme"
							/>
						</div>
						<div class="flex items-center justify-center py-5">
							<Avatar
							  	:shape="'circle'"
							  	:ref_for="true"
								size="xl"
								class=" h-24 w-24 border-1 border-zinc-500 "
								:image="`${user.data.user_image}?t=${Date.now()}`"
								:label="user.data.full_name"
							/>
						</div>
						<div class="flex-col items-start justify-start ion-margin">
							<ion-label>{{ t('preferences.language') }}</ion-label>
							<Input
								class="rounded-xl py-2"
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
					</ion-card>
					<Button
						class="rounded-xl ion-margin-top text-white w-full hover:bg-red-800 bg-red-700"
              			:variant="'solid'"
						theme="red"
						size="md"
						@click="session.logout.submit()"
						>{{ t("auth.logout") }}</Button>
				</div>
				<div v-else class="m-6 flex flex-col items-center"> 
					<Button
						class="rounded-xl ion-margin-top text-white w-full hover:bg-red-800 bg-red-700"
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
import { Avatar, createResource, Button } from "frappe-ui"
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
	IonCard,
	IonIcon,
	IonLabel
} from "@ionic/vue"
import { moon, sunny } from "ionicons/icons"
import { urlPort } from "@/utils/checkIP"
import { frappeSDK } from "@/utils/frappeSDK"
const session = <any>inject(sessionInjectionKey)
const user = <any>inject(userResourceInjectionKey)
const { call } = frappeSDK();
const appVersion = ref(null)
const getApp = async() => {
	const res = await call.get('dma.api.get_app_version');
	appVersion.value = res.message
}
/*const appVersion = createResource({
	url: "http://erp.alzo.io:10580/api/method/dma.api.get_app_version",
	auto: true,
})*/
const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
const { t, locale } = useI18n()
const availableLanguages = [
	{ label: "English", value: "en" },
	{ label: "ไทย", value: "th" },
]
const toggleTheme = () => {
	isDarkMode.value = !isDarkMode.value
	document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value)
	localStorage.setItem("darkMode", JSON.stringify(isDarkMode.value))
}

onMounted(() => {
	setDefaultLanguage()
	refreshUser()
	getApp()

	// Load from localStorage
	const savedMode = localStorage.getItem("darkMode")
	if (savedMode !== null) {
		isDarkMode.value = JSON.parse(savedMode)
		document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value)
	}
})

watch(locale, (newLocale) => {
	localStorage.setItem("preferredLanguage", newLocale)
})

const refreshUser = async () => {
	if(user.data.first_name === ""){
		await userResource.reload()
		user.data = userResource.data
	}
}

</script>
