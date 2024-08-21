<template>
	<ion-page>
		<ion-content :fullscreen="true">
			<div class="m-4 flex h-full flex-col justify-center">
				<Card>
					<h1 class="pb-5 text-center text-2xl font-bold text-gray-800">
						Login to ALZO Mobile App
					</h1>
					<form class="flex flex-col space-y-3" @submit.prevent="submit">
						<Input
							class="rounded-xl py-2"
							required
							name="email"
							type="text"
							placeholder="johndoe@mail.com"
							:label="t('auth.email')"

						/>
						<Input
							class="rounded-xl py-2"
							required
							name="password"
							type="password"
							placeholder="••••••"
							:label="t('auth.password')"

						/>
						<Button
							class="rounded-xl py-2"
							:loading="session.login.loading"
							appearance="primary"
							>{{ t("auth.login") }}</Button
						>
					</form>
					<div class="flex flex-col space-y-3">
					<Button appearance="primary" class="login-button rounded-xl py-2" @click="oauthLogin">OAuth Login</Button>
					</div>
				</Card>
			</div>
		</ion-content>
	</ion-page>
</template>

<script lang="ts" setup>
import { inject, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { IonPage, IonContent } from "@ionic/vue";
import { sessionInjectionKey } from "@/typing/InjectionKeys";
import { userEmail } from "@/data/userStore";
import axios from 'axios'
import Cookies from 'js-cookie';
import router from "@/router";
const { t } = useI18n();
const session = inject(sessionInjectionKey);
const dynamicPort = window.location.port;
const port = dynamicPort.toString()
function submit(e: Event) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email")?.toString() || "";
    const password = formData.get("password")?.toString() || "";
	
    if (email) {
        userEmail.value = email; 
        if (session && session.login) {
            session.login.submit({ email, password });
			
        }
    }
}
//another login 

const oauthLogin = async () => {
      const clientId = '095c96880d';
      const redirectUri = `http://192.168.10.105:${port}/d/account/login`;
      const frappeOAuthUrl = `http://192.168.10.105:8001/api/method/frappe.integrations.oauth2.authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=all`;
      window.location.href = frappeOAuthUrl;
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
        'http://192.168.10.105:8001/api/method/frappe.integrations.oauth2.get_token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: `http://192.168.10.105:${port}/d/account/login`,
          client_id: '095c96880d',
          client_secret: 'd74b5cdd25',
        }),
      );
      console.log('Full token response:', response.data); 
      const token = response.data.access_token;
      console.log('Access token:', token); 
      if (token) {
        const userInfoResponse = await axios.get('http://192.168.10.105:8001/api/method/frappe.integrations.oauth2.openid_profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const username = userInfoResponse.data.name; 
        console.log('Username:', username);
        Cookies.set('user_id', username);
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
  console.log(port)
</script>

<style scoped>
.login-button{
	margin-top: 20px;
}
</style>