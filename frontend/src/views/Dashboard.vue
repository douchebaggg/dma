<template class="bg-black">
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="m-4 space-y-6">
				<h1 class=" text-2xl">{{ t("greeting.hi") }} {{ user.data.full_name }}</h1>
				<div>
					<h3 class="text-xl font-semibold text-gray-900">
						{{ t("dashboard.enter_data.header") }}
					</h3>
					<div class="mt-3 grid grid-cols-2 gap-5 ">
						<RouterLink :to="{ name: 'BasketEntry' }" v-slot="{ href }">
							<a
								:href="href"
								class="flex flex-col items-center gap-3 rounded-xl bg-white p-[14px] shadow-md h-34"
							>
								<FrappeIcons.Baskets />
								<h3 class="text-sm font-medium text-center text-gray-900">
								{{ t("labels.baskets") }}
								</h3>
							</a>
						</RouterLink>
						<RouterLink :to="{ name: 'MediaEntry' }" v-slot="{ href }">
							<a
								:href="href"
								class="flex flex-col items-center gap-3 rounded-xl bg-white p-[14px] shadow-md h-34"
							>
								<FrappeIcons.Media />
								<h3 class="text-sm font-medium text-gray-900">
								{{ t("labels.media") }}
								</h3>
							</a>
						</RouterLink>
					</div>
				</div>

				<!-- OEM -->
				<div class="space-y-4">
					<h3 class="text-xl font-semibold text-gray-900">
						{{ t("dashboard.warehouse.header") }}
					</h3>
					<div class="mt-3 grid grid-cols-2 gap-5">
						<RouterLink :to="{ name: 'OEM_productsEntry' }" v-slot="{ href }">
							<a
								:href="href"
								class="flex flex-col items-center gap-3 rounded-xl bg-white p-[14px] shadow-md h-34"
							>
								<FrappeIcons.TicketIcon />
								<h3 class="text-sm font-medium text-gray-900">
									{{ t("labels.oem") }}
								</h3>
							</a>
						</RouterLink>						
						<RouterLink :to="{ name: 'PalletsEntry' }" v-slot="{ href }">
							<a
								:href="href"
								class="flex flex-col items-center gap-3 rounded-xl bg-white p-[14px] shadow-md h-34"
							>
								<FrappeIcons.Pallets />
								<h3 class=" text-sm font-medium text-gray-900">
									{{ t("labels.pallets") }}
								</h3>
							</a>
						</RouterLink>
					</div>
				</div>

				<!-- Data -->
				<div class="space-y-4">
					<div class="flex items-center">
					<h3 class="text-xl font-semibold text-gray-900 w-36">
						{{ t("dashboard.today.header",) }}
					</h3>					
				</div>

				<div class="flex flex-col gap-[2px]">
						<RouterLink
							:to="{ name: 'Entitlement RequestList' }"
							v-slot="{ href }"
						>
							<a
								:href="href"
								class="flex items-center justify-between gap-3 rounded-t-xl bg-white p-[14px] shadow-md"
							>
								<div class="flex items-center gap-3">
									<FeatherIcon name="clipboard" class="h-6 w-6 text-gray-700" />
									<h3 class="text-sm font-medium text-gray-900">
										{{ t("labels.process_order") }}
									</h3>
								</div>
								<FeatherIcon
									name="chevron-right"
									class="h-6 w-6 text-gray-700"
								/>
							</a>
						</RouterLink>
						<RouterLink
							:to="{ name: 'Awareness Camp RecordList' }"
							v-slot="{ href }"
						>
							<a
								:href="href"
								class="flex items-center justify-between gap-3 rounded-b-xl bg-white p-[14px] shadow-md"
							>
								<div class="flex items-center gap-3">
									<FrappeIcons.AwarenessCampIcon class="h-6 w-6" />
									<h3 class="text-sm font-medium text-gray-900">
										{{ t("labels.product_code") }}
									</h3>
								</div>
								<FeatherIcon
									name="chevron-right"
									class="h-6 w-6 text-gray-700"
								/>
							</a>
						</RouterLink>
					</div>
				</div>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
	import { inject, onMounted } from "vue"
	import { useI18n } from "vue-i18n"
	import { RouterLink } from "vue-router"
	import { IonPage, IonContent,IonList,IonSelect,IonSelectOption,IonItem } from "@ionic/vue"
	import { FrappeIcons } from "@/components/icons"
	import { userResourceInjectionKey } from "@/typing/InjectionKeys"
	import { createDocumentResource, FeatherIcon, ListView } from "frappe-ui"
	import { DocumentResource } from "@/typing/resource"
	import { Beneficiary } from "@/../types/FrappeChangemakers/Beneficiary"
	import { setDefaultLanguage } from "@/locales/devices"

	onMounted(() => {
	setDefaultLanguage()
})
	const user = inject(userResourceInjectionKey)
	const { t } = useI18n()
	/*const beneficiaryDoc: DocumentResource<Beneficiary> = createDocumentResource({
		doctype: "Beneficiary",
		name: "BENE-2022-12-00002",
	});*/

	//for ion-select handle

	//beneficiaryDoc.reload();


</script>

<script lang="ts">
	import { IonDatetime, IonDatetimeButton, IonModal } from '@ionic/vue';
	import { defineComponent } from 'vue';

	export default defineComponent({
		components: { IonDatetime, IonDatetimeButton, IonModal, },
	}); 
</script>
