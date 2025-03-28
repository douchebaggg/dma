import { computed, reactive, ComputedRef } from "vue";
import { userResource } from "./user";
import { userEmail,} from "./userStore";
import router from "@/router";
import { getCookie } from "typescript-cookie";
import { isLocalNetwork, currentHost, apiPort } from "@/utils/checkIP";
import { toastController } from "@ionic/vue";
import { FrappeApp } from "frappe-js-sdk";
import { createResource } from "frappe-ui";
import axios from "axios";

const api = isLocalNetwork() ? `http://${currentHost}:${apiPort}` : `http://erp.alzo.io:10580`;
const frappe = new FrappeApp(api,);
const auth = frappe.auth();

export function sessionUser() {
    let _sessionUser = getCookie("user_id") 
    if (!_sessionUser || _sessionUser === "Guest") {
        _sessionUser = userEmail.value;
    }
    if (_sessionUser === "Guest") {       
        _sessionUser = null;
    }
    return _sessionUser;
}

interface LoginCredentials {
    email: string;
    password: string;
}

const presentToast = async (message: string) => {
    const toast = await toastController.create({
        message,
        duration: 2000,
        position: "top",
        color: "danger",
    });
    await toast.present();
};

export interface Session {
    login: {
        loading: boolean;
        submit: (credentials: LoginCredentials) => Promise<void>; 
    };
    logout: {
        loading: boolean;
        submit: () => Promise<void>; 
    };
    user: null | string;
    isLoggedIn: ComputedRef<boolean>;
}

const sessionState = reactive({
    login: {
        loading: false,
        async submit({ email, password }: LoginCredentials) {
            sessionState.login.loading = true;
            try {
                await auth.loginWithUsernamePassword({ username: email, password });
                userResource.reload();
                sessionState.user = sessionUser();
                router.replace("/tabs/dashboard");
                console.log("Login success");
            } catch (error) {
                presentToast("Your email or password is incorrect");
                console.error("Login error:", error);
            } finally {
                sessionState.login.loading = false;
            }
        },
    },
    logout: createResource({
        url: `${api}/api/method/logout`,
        onSuccess() {
            userResource.reset();
            sessionState.user = sessionUser();
            router.replace({ name: "Login" });
            localStorage.clear();
        },
        onError(error: any) {
            console.error("Logout error:", error);
        },
    }),
    user: sessionUser(),
});

// Computed property must be declared separately
const isLoggedIn = computed(() => !!sessionState.user);

export const session: Session = {
    ...sessionState,
    isLoggedIn, // Assign computed separately
};
