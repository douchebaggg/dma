import { RouteRecordRaw } from "vue-router"
import BasketListPage from "@/views/baskets/Basket.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "BasketEntry",
		path: "/baskets",
		component: BasketListPage,
	},
]

export default routes
