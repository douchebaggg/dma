import { RouteRecordRaw } from "vue-router"
import OEM_Products_ListPage from "@/views/oem_products/List.vue"
import OEM_Products_FormView from "@/views/oem_products/Details.vue"
import OEM_Products_DetailsView from "@/views/oem_products/Form.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "OEM_productsEntry",
		path: "/oem_products",
		component: OEM_Products_ListPage,
	},
	{
		name: "New_oem_productsForm",
		path: "/oem_products/new",
		component: OEM_Products_FormView,
	},
	{
		name: "oem_productsForm",
		path: "/oem_products/:id",
		props: true,
		component: OEM_Products_DetailsView,
	},
]

export default routes
