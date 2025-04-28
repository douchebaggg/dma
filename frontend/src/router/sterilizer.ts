import { RouteRecordRaw } from "vue-router"
import Sterilizer_List from "@/views/sterilizer/Sterilizer.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "OEM_productsEntry",
		path: "/oem_products",
		component: Sterilizer_List,
	},
]

export default routes
