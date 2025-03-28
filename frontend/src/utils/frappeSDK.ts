import { FrappeApp } from "frappe-js-sdk";
import { isLocalNetwork, currentHost, apiPort } from "./checkIP";
const api = isLocalNetwork() ? `http://${currentHost}:${apiPort}` : `http://erp.alzo.io:10580`;

export const frappeSDK = () => {
    const frappe = new FrappeApp(api)
    return {
        auth: frappe.auth(),
        db: frappe.db(),
        call: frappe.call(),
        file: frappe.file(),
    };
}