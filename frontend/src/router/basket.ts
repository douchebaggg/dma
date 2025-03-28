import { RouteRecordRaw } from "vue-router"
import BasketListPage from "@/views/baskets/List.vue"
import BasketFormView from "@/views/baskets/Details.vue"
import BasketDetailsView from "@/views/baskets/Form.vue"

const routes: Array<RouteRecordRaw> = [
	{
		name: "BasketEntry",
		path: "/baskets",
		component: BasketListPage,
	},
	{
		name: "NewBasketForm",
		path: "/baskets/new",
		component: BasketFormView,
	},
	{
		name: "BasketForm",
		path: "/baskets/:id",
		props: true,
		component: BasketDetailsView,
	},
]

export default routes
