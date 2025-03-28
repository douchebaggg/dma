import router from "@/router";
//import { createResource } from "frappe-ui";
import { sessionUser } from "./session";
import { FrappeApp } from "frappe-js-sdk";
//import { ref } from "vue";
//import axios from "axios";
import { reactive } from "vue";
import {isLocalNetwork,currentHost,apiPort} from "@/utils/checkIP";
const user_id = sessionUser()
console.log(user_id)
 
const apiUrl = isLocalNetwork() ? `http://${currentHost}:${apiPort}` : `http://erp.alzo.io:10580`;
const frappe = new FrappeApp(apiUrl);

export interface UserResource {
    data: undefined | { first_name: string; full_name: string; user_image: string };
    reload: () => Promise<void>;
    reset: () => void;
}

const db = frappe.db();
/*const getUserData = async (userId: string) => {
    try {
        const userDoc = await db.getDoc('User', userId);
        console.log(userDoc)
        return {
            first_name: userDoc.first_name,
            full_name: userDoc.full_name,
            user_image: userDoc.user_image,
        };
    } catch (error) {
        console.error("Failed to fetch user data:", error);
        throw error;
    }
};

const docList = ref(null);
const getTokenFromLocalStorage = () => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      try {
        const parsedAuthState = JSON.parse(authState);
        return parsedAuthState.token;
      } catch (error) {
        console.error('Error parsing auth state from local storage:', error);
        return null;
      }
    }
    console.error('No auth state found in local storage');
    return null;
  };

  const token = getTokenFromLocalStorage();
    if (!token) {
      console.error('No auth token found in local storage');
    }*/
 /*export const userResource: UserResource = createResource({
    url: "http://192.168.68.54:8080/api/method/dma.api.get_current_user_info",
    async onSuccess(){
        try {
            const response = await axios.get(`http://192.168.10.105/api/resource/User/${user_id}`);
            docList.value = response.data.data.name
            console.log(response.data.data.name);
            const userData = await getUserData(user_id);
            userResource.data = userData;
          } catch (error) {
            console.error('Error fetching documents:', error);
          }
        
    },
    onError(error) {
        if (error && error.exc_type === "AuthenticationError") {
            router.push({ name: "LoginPage" });
        } else {
            console.error("An error occurred:", error);
        }
    },
});*/
class UserResourceImpl implements UserResource {
    data = reactive<UserResource['data']>({ first_name: '', full_name: '', user_image: '' });

    async reload(): Promise<void> {
        const user_id = sessionUser(); // Fetch user ID dynamically
        if (!user_id) {
            console.log('No user ID available');
            this.reset();
            return;
        } else {
            console.log(user_id);
        }
        try {
            const userDoc = await db.getDoc('User', user_id);
            this.data.first_name = userDoc.first_name;
            this.data.full_name = userDoc.full_name;
            this.data.user_image = userDoc.user_image;
        } catch (error: any) {
            if (error.httpStatus === 403) {
                console.error('Authentication error');
                router.push({ name: "LoginPage" });
            } else {
                console.error("Failed to fetch user data:", error);
                this.reset(); // Reset data for other errors
            }
        }
    }

    reset(): void {
        this.data.first_name = "";
        this.data.full_name = "";
        this.data.user_image = "";
    }
}

export const userResource = new UserResourceImpl();

userResource.reload();
