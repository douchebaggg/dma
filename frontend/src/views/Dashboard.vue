<template class="bg-black">
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="m-4 space-y-6">
				<h1 class=" text-2xl">{{ t("greeting.hi") }} {{ user.data.full_name }}</h1>
				<div>
					
					<ion-text class="text-xl font-semibold ">
						{{ t("dashboard.enter_data.header") }}
					</ion-text>
					
					<div class="mt-3 grid grid-cols-2 gap-5">
						
						<RouterLink :to="{ name: 'BasketEntry' }" v-slot="{ href }">
							<ion-card class="flex gap-3 flex-col justify-center items-center rounded-xl p-[14px] shadow-md h-34">
								<FrappeIcons.Baskets />
								<ion-text class="text-sm font-medium text-center">
								{{ t("labels.baskets") }}
								</ion-text>
							</ion-card>
						</RouterLink>
						<RouterLink :to="{ name: 'Sterilizer' }" v-slot="{ href }">
							<ion-card class="flex gap-3 flex-col justify-center items-center rounded-xl p-[14px] shadow-md h-34">
								<FrappeIcons.Media />
								
								<ion-text class="text-sm font-medium text-center ">
								{{ t("labels.media") }}
								</ion-text>
							</ion-card>
						</RouterLink>
					</div>
				</div>

				<!-- OEM -->
				<div class="space-y-4">
					
					<ion-text class="text-xl font-semibold ">
						{{ t("dashboard.warehouse.header") }}
					</ion-text>
					
					<div class="mt-3 grid grid-cols-2 gap-5">
						<RouterLink :to="{ name: 'SeamEntry' }" v-slot="{ href }">
							<ion-card class="flex gap-3 flex-col justify-center items-center rounded-xl p-[14px] shadow-md h-34">
								<FrappeIcons.TicketIcon />
								
								<ion-text class="text-sm font-medium text-center ">
									{{ t("labels.seam") }}
								</ion-text>
								
							</ion-card>
						</RouterLink>						
						<RouterLink :to="{ name: 'PalletsEntry' }" v-slot="{ href }">
							<ion-card class="flex gap-3 flex-col justify-center items-center rounded-xl p-[14px] shadow-md h-34">
								<FrappeIcons.Pallets />
								
								<ion-text class=" text-sm font-medium text-center ">
									{{ t("labels.pallets") }}
								</ion-text>
								
							</ion-card>
						</RouterLink>
					</div>
				</div>

				<!-- Data -->
				<div class="space-y-4">
					<div class="flex items-center">
					
					<ion-text class="text-xl font-semibold  w-36">
						{{ t("dashboard.today.header") }}
					</ion-text>				
						
				</div>

				<div class="flex flex-col gap-[2px]">
						<RouterLink
							:to="{ name: 'Sale' }"
							v-slot="{ href }"
						>
							<ion-card class="flex items-center justify-between gap-3 rounded-t-xl  p-[14px] shadow-md">
								<div class="flex items-center gap-3">
									<FrappeIcons.Buying class="h-6 w-6" />
									<ion-text class="text-sm font-medium ">
										{{ t("labels.buy") }}
									</ion-text>
								</div>
								<FeatherIcon
									name="chevron-right"
									class="h-6 w-6 text-gray-700"
								/>
							</ion-card>
						</RouterLink>
						<RouterLink
							:to="{ name: 'Sale' }"
							v-slot="{ href }"
						>
							<ion-card class="flex items-center justify-between gap-3 rounded-b-xl  p-[14px] shadow-md">
								<div class="flex items-center gap-3">
									<FrappeIcons.Selling class="h-6 w-6" />
									<ion-text class="text-sm font-medium ">
										{{ t("labels.sale") }}
									</ion-text>
								</div>
								<FeatherIcon
									name="chevron-right"
									class="h-6 w-6 text-gray-700"
								/>
							</ion-card>
						</RouterLink>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
	import { inject, onMounted, ref } from "vue"
	import { useI18n } from "vue-i18n"
	import { RouterLink } from "vue-router"
	import { IonPage, IonContent,IonCard,IonText } from "@ionic/vue"
	import { FrappeIcons } from "@/components/icons"
	import { userResourceInjectionKey } from "@/typing/InjectionKeys"
	import { FeatherIcon} from "frappe-ui"
	import { setDefaultLanguage } from "@/locales/devices"

	onMounted(() => {
	setDefaultLanguage()
	setDefaultTheme()
})
	const user = inject(userResourceInjectionKey) as any
	const { t } = useI18n()
	const isDarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)
	const setDefaultTheme = () => {
		const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
		if (isDarkMode.value = prefersDarkScheme.matches) {
			document.documentElement.classList.toggle('ion-palette-dark', isDarkMode.value);
			localStorage.setItem("darkMode", JSON.stringify(isDarkMode.value))
		} else {
			document.documentElement.classList.remove('ion-palette-dark');
			localStorage.setItem("darkMode", JSON.stringify(isDarkMode.value))
		}
	};
</script>