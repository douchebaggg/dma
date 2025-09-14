<template>
	<ion-tab-bar slot="bottom" class=" pt-4 shadow-[1px_-3px_6px_0px_rgba(0,_0,_0,_0.1)]">
		<div class=" grid grid-cols-4">
		<ion-tab-button
			class="rounded-l-md pb- "
			tab="dashboardTab"
			href="/tabs/dashboard"
		>
			<DashboardIcon
				:class="
					route.path == '/tabs/dashboard' ? 'text-gray-600' : 'text-gray-500'
				"
				class="h-7 w-7"
			/>
			<p class=" py-1 text-sm">{{ t("nav.dashboard") }}</p>
		</ion-tab-button>
		<ion-tab-button
			class="rounded-r-md mb-4"
			tab="DocTab"
			href="/tabs/doctype"
		>
		<DocumentIcon
		:class="
		route.path == '/tabs/docType' ? 'text-gray-600' : 'text-gray-500'"
		class="h-7 w-7"
		/>
		<p class=" py-1 text-sm">{{ t("nav.document") }}</p>
		</ion-tab-button>
		<ion-tab-button
			class="rounded-r-md mb-4"
			tab="QRScanTab"
			href="/tabs/qrscaner"
		>
			<QrScan
				:class="
					route.path == '/tabs/qrscaner' ? 'text-gray-600' : 'text-gray-500'
				"
				class="h-7 w-7 "
			/>
			<p class=" py-1 text-sm">QR Scan</p>
		</ion-tab-button>
		<ion-tab-button
			class="rounded-r-md mb-4"
			tab="AccountTab"
			href="/tabs/account"
		>
			<ProfileIcon
				:class="
					route.path == '/tabs/account' ? 'text-gray-600' : 'text-gray-500'
				"
				class="h-7 w-7"
			/>
			<p class=" py-1 text-sm">{{ t("nav.account") }}</p>
		</ion-tab-button>

		</div>
	</ion-tab-bar>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import DashboardIcon from "@/components/icons/Dashboard.vue"
import ProfileIcon from "@/components/icons/Profile.vue"
import { IonTabBar, IonTabButton } from "@ionic/vue"
import DocumentIcon from "../icons/Document.vue"
import QrScan from "../icons/QrScan.vue"
const route = useRoute()
const { t } = useI18n()
</script>
