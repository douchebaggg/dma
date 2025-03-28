<template>
	<ion-tab-bar slot="bottom" class="bg-white pt-[10px] shadow-[1px_-3px_6px_0px_rgba(0,_0,_0,_0.1)]">
		<ion-tab-button
			class="rounded-l-md bg-white"
			tab="dashboardTab"
			href="/tabs/dashboard"
		>
			<DashboardIcon
				:class="
					route.path == '/tabs/dashboard' ? 'text-gray-900' : 'text-gray-500'
				"
				class="h-7 w-8"
			/>
			<p class=" py-1 text-gray-900">{{ t("nav.dashboard") }}</p>
		</ion-tab-button>
		<ion-tab-button
			class="rounded-r-md bg-white"
			tab="DocTab"
			href="/tabs/docType"
		>
		<DocumentIcon
		:class="
		route.path == '/tabs/docType' ? 'text-gray-900' : 'text-gray-500'"
		class="h-8 w-8"
		/>
		<p class=" py-1 text-gray-900">{{ t("nav.document") }}</p>
		</ion-tab-button>
		<ion-tab-button
			class="rounded-r-md bg-white"
			tab="AccountTab"
			href="/tabs/account"
		>
			<ProfileIcon
				:class="
					route.path == '/tabs/account' ? 'text-gray-900' : 'text-gray-500'
				"
				class="h-8 w-8"
			/>
			<p class=" py-1 text-gray-900">{{ t("nav.account") }}</p>
		</ion-tab-button>
	</ion-tab-bar>
</template>

<script lang="ts" setup>
import { useRoute } from "vue-router"
import { useI18n } from "vue-i18n"
import DashboardIcon from "@/components/icons/Dashboard.vue"
import ProfileIcon from "@/components/icons/Profile.vue"
import { IonTabBar, IonTabButton } from "@ionic/vue"
import DocumentIcon from "../icons/Document.vue"
const route = useRoute()
const { t } = useI18n()
</script>
