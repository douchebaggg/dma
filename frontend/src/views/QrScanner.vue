<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="ion-text-center">Test QR Scanner</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
        <div class="flex flex-col items-center m-4">
         <video id="video" class=" w-[80dvw]" autoplay></video>
         <p v-if="result"> Docname: {{ result }}</p>
        </div>
		</ion-content>

	</ion-page>
</template>
<script lang="ts" setup>
import {
	IonPage,
	IonHeader,
	IonToolbar,
	IonTitle,
	IonContent,
} from "@ionic/vue"
import { ref, onMounted, onBeforeUnmount } from "vue";
import { BrowserQRCodeReader } from '@zxing/browser';
import { frappeSDK } from "@/utils/frappeSDK";
import { updateThemeColor,setDefaultTheme } from "@/utils/themeHandle"

const result = ref<string | null>(null);
let codeReader: BrowserQRCodeReader;

const qrScan = async () => {
    codeReader = new BrowserQRCodeReader();
    try {
        const videoElement = document.getElementById("video") as HTMLVideoElement;
        const decodeResult = await codeReader.decodeOnceFromVideoDevice(
        undefined,
        videoElement
        );

        result.value = decodeResult.getText();
        console.log("Docname:", result.value);
    } catch (err) {
        console.error("Error scanning QR:", err);
    }

}

onMounted(async () => {
    qrScan();
});


onMounted(() => {
  	setDefaultTheme()
	updateThemeColor()
})
</script>