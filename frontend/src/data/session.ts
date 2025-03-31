import { computed, reactive, ComputedRef } from "vue";
import { userResource } from "./user";
import router from "@/router";
import { toastController } from "@ionic/vue";
import { frappeSDK } from "@/utils/frappeSDK";
import { createResource } from "frappe-ui";
import axios from "axios";
import { urlPort,url } from "@/utils/checkIP";
const { auth } = frappeSDK();

export function sessionUser() {
	const cookies = new URLSearchParams(document.cookie.split("; ").join("&"))
	let _sessionUser = cookies.get("user_id")
    if (!_sessionUser || _sessionUser === "Guest") {
        _sessionUser = null
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
        error: boolean;
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
        error: false,
        async submit({ email, password }: LoginCredentials) {
            sessionState.login.loading = true;
            try {
                await auth.loginWithUsernamePassword({ username: email, password });
                userResource.reload();
                sessionState.user = sessionUser();
                router.replace("/tabs/dashboard");
                sessionState.login.error = false;
                console.log("Login success");
            } catch (error) {
                presentToast("Your email or password is incorrect");
                sessionState.login.error = true;
                console.error("Login error:", error);
            } finally {
                sessionState.login.loading = false;
            }
        },
    },
    logout: createResource({
        url: `${url}/api/method/logout`,
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


const isLoggedIn = computed(() => !!sessionState.user);

export const session: Session = {
    ...sessionState,
    isLoggedIn,
};