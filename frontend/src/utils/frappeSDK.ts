import { FrappeApp } from "frappe-js-sdk";
import { urlPort, url } from "./checkIP";

export const frappeSDK = () => {
    const frappe = new FrappeApp(urlPort)
    return {
        auth: frappe.auth(),
        db: frappe.db(),
        call: frappe.call(),
        file: frappe.file(),
    };
}