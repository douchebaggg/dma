<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="m-4 flex h-full flex-col justify-center">
				<ion-card class="border-0 shadow-[3px_4px_14px_5px_rgba(0,_0,_0,_0.35)] ion-margin">
					<h1 class="pb-5 text-center text-xl font-bold text-gray-800">
						Login to ALZO Mobile App
					</h1>
					<form class="flex flex-col space-y-3 ion-margin" @submit.prevent="submit">
						<Input
							class="rounded-xl py-1"
							required
							name="email"
							type="text"
							placeholder="info@alzo.io"
							:label="t('auth.email')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"

						/>
						<Input             
							class="rounded-xl py-1"
							required
							name="password"
							type="password"
							placeholder="••••••"
							:label="t('auth.password')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
						/>
						<Button 
							class="rounded-xl  text-white ion-margin-top bg-[#171717]"
              :variant="'solid'"

              size="md"
							:loading="session.login.loading"
							>{{ t("auth.login") }}</Button>
            <Button
               v-if="loginFailed"
              class="rounded-xl text-white ion-margin-top bg-[#171717]" 
              :variant="'solid'"
              size="md"
              @click="oauthLogin">OAuth Login</Button>
					</form>


				</ion-card>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { inject, onMounted, ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { IonPage, IonContent, IonCard } from "@ionic/vue";
import { sessionInjectionKey } from "@/typing/InjectionKeys";
import { Browser } from "@capacitor/browser";
import { url } from "@/utils/checkIP";
import axios from 'axios'
import router from "@/router";
const { t } = useI18n();
const session = inject(sessionInjectionKey) as any;
const loginFailed = computed(() => session.login.error); 
const api = url;
async function submit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
	
    if (email) {
        try {
          await session.login.submit({ email, password });
        } catch (error) {
          console.error("Login error:", error);
        }
      }
}
//another login 

const oauthLogin = async () => {
      const clientId = 'ml8j3o2ql9';
      const redirectUri = `http://localhost:5173/d/account/login`;
      const frappeOAuthUrl = `${api}/api/method/frappe.integrations.oauth2.authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all`;
      window.open(frappeOAuthUrl,'_blank', 'noopener,noreferrer');
    };
    onMounted(() => {
      handleOAuth();
    });
  const handleOAuth = async () =>{
    const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
    try {
      const response = await axios.post(
        `${api}/api/method/frappe.integrations.oauth2.get_token`,
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `http://localhost:5173/d/account/login`,
          client_id: 'ml8j3o2ql9',
          client_secret: 'eae6234da9',
        }),
      );
      console.log('Full token response:', response.data); 
      const token = response.data.access_token;
      console.log('Access token:', token); 
      if (token) {
        const userInfoResponse = await axios.get(`${api}/api/method/frappe.integrations.oauth2.openid_profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const username = userInfoResponse.data.name; 
        console.log('Username:', username);
        localStorage.setItem('token',token)
        session.user = username;
        router.push({ name: 'Home' });
      } else {
        throw new Error('Token not found in response');
      }
    } catch (error) {
      console.error('OAuth error:', error);
    }
  }
  }  

</script>