import { computed, reactive } from "vue";
import { createResource } from "frappe-ui";
import { userResource } from "./user";
import { userEmail } from "./userStore";
import Cookies from 'js-cookie'
import router from "@/router";
export function sessionUser() {
   // const cookies = new URLSearchParams(document.cookie.split("; ").join("&"));
    let _sessionUser = Cookies.get("user_id") 
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
        url: "http://192.168.10.105:8001/api/method/login",
        makeParams({ email, password }) {
            return {
                usr: email,
                pwd: password,
            };
        },
        onSuccess(data) {
            userResource.reload();
            session.user = sessionUser();
            session.login.reset();
            router.replace(data.default_route || "/tabs/dashboard");
            console.log("Login success")
        },
        onError(error) {
            console.error("Login error:", error, session.login, session.user); 
        },
    }),
    logout: createResource({
        url: "http://192.168.10.105:8001/api/method/logout",
        onSuccess() {
            userResource.reset();
            session.user = sessionUser();
            router.replace({ name: "Login" });
            
        },
        onError(error) {
            console.error("Logout error:", error); 
        },
    }),
    user: sessionUser(),
    isLoggedIn: computed(() => !!session.user),
});