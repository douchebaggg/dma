import { RouteRecordRaw } from "vue-router"
import OEM_Products_ListPage from "@/views/oem_products/OEMProducts.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "OEM_productsEntry",
		path: "/oem_products",
		component: OEM_Products_ListPage,
	},
]

export default routes
