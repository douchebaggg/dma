import { RouteRecordRaw } from "vue-router"
import PalletsListPage from "@/views/pallets/Pallet.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "PalletsEntry",
		path: "/pallets",
		component: PalletsListPage,
	},
]

export default routes
