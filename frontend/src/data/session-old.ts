import { computed, onErrorCaptured, reactive } from "vue";
import { createResource } from "frappe-ui";
import { userResource } from "./user";
import { userEmail } from "./userStore";
import router from "@/router";
import { getCookie } from "typescript-cookie";
import { isLocalNetwork, currentHost, apiPort } from "@/utils/devIP";
import { toastController } from "@ionic/vue";
import axios from "axios";
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

const apiUrl = isLocalNetwork() ? `http://${currentHost}:${apiPort}/` : `http://erp.alzo.io:10580/api/method`;
const instance = axios.create({
    baseURL: apiUrl,
    withCredentials: true,
})
const presentToast = async (position: 'top' | 'middle' | 'bottom') => {
    const toast = await toastController.create({
      message: 'Your email or password is incorrect',
      duration: 2000,
      position: position,
      color: 'danger',
    });
    
    await toast.present();
  };
export interface Session {
    login: {
        loading: boolean;
        submit: (credentials: LoginCredentials) => Promise <void>; 
        reset: () => void;
    };
    logout: {
        loading: boolean;
        submit: () => Promise<void>; 
        reset: () => void;
    };
    user: null | string;
    isLoggedIn: boolean;
}

export const session: Session = reactive({
    login: createResource({
        url: `${apiUrl}/api/method/login`,
        makeParams({ email, password }) {
            return {
                usr: email,
                pwd: password,
            };
        },
        onSuccess(data:any) {
            userResource.reload();
            session.user = sessionUser();
            session.login.reset();
            router.replace(data.default_route || "/tabs/dashboard");
            console.log("Login success")
        },
        onError(error:any) {
            presentToast('top');
            console.error("Login error:", error, session.login, session.user); 
        },
    }),
    logout: createResource({
        url: `${apiUrl}/api/method/logout`,
        onSuccess() {
            userResource.reset();
            session.user = sessionUser();
            router.replace({ name: "Login" });

            localStorage.clear();
            
        },
        onError(error:any) {
            console.error("Logout error:", error); 
        },
    }),
    user: sessionUser(),
    isLoggedIn: computed(() => !!session.user),
});