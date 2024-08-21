import router from "@/router";
import { createResource } from "frappe-ui";
import { sessionUser } from "./session";
import { FrappeApp } from "frappe-js-sdk";
//import { ref } from "vue";
//import axios from "axios";
const user_id = sessionUser()
console.log(user_id)
const frappe = new FrappeApp('http://192.168.10.105:8001/');

export interface UserResource {
    data: undefined | { first_name: string; full_name: string; user_image: string };
    reload: () => Promise<void>;
    reset: () => void;
}

const db = frappe.db();

const getUserData = async (userId: string) => {
    try {
        const userDoc = await db.getDoc('User', userId);
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

//const docList = ref(null);
/*const getTokenFromLocalStorage = () => {
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


export const userResource: UserResource = createResource({
    url: `http://192.168.10.105:8001/api/resource/User/${user_id}`,
    async onSuccess() {
        try {
            const userData = await getUserData(user_id);
            userResource.data = userData;
        } catch (error) {
            console.error("Failed to set user data:", error,user_id);
        }
    },
   /* async onSuccess(){
        try {
            const response = await axios.get('http://192.168.10.105:8001/api/resource/User/${user_id}', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            docList.value = response.data.data.name
            console.log(response.data.data.name);
            const userData = await getUserData(user_id);
            userResource.data = userData;
          } catch (error) {
            console.error('Error fetching documents:', error);
          }
        
    },*/
    onError(error) {
        if (error && error.exc_type === "AuthenticationError") {
            router.push({ name: "LoginPage" });
        } else {
            console.error("An error occurred:", error);
        }
    },
});