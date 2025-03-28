import { RouteRecordRaw } from "vue-router"
import PalletsListPage from "@/views/pallets/List.vue"
import PalletsFormView from "@/views/pallets/Details.vue"
import PalletsDetailsView from "@/views/pallets/Form.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "PalletsEntry",
		path: "/pallets",
		component: PalletsListPage,
	},
	{
		name: "NewPalletsForm",
		path: "/pallets/new",
		component: PalletsFormView,
	},
	{
		name: "PalletsForm",
		path: "/pallets/:id",
		props: true,
		component: PalletsDetailsView,
	},
]

export default routes
