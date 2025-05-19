import { RouteRecordRaw } from "vue-router"
import SaleList from "@/views/selling/SalesList.vue"

const routes: Array<RouteRecordRaw> = [
    {
        name: "Sale",
        path: "/sale",
        component: SaleList,
    },
]

export default routes