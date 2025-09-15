<template>
	<ion-page>
		<ion-header>
			<ion-toolbar>
				<ion-title class="ion-text-center">Test QR Scanner</ion-title>
			</ion-toolbar>
		</ion-header>
		<ion-content>
        <div class="flex flex-col items-center m-4">
         <video id="video" class=" h-92 rounded-lg" 
         autoplay  
         playsinline
         muted>
        </video>
        <div class="ion-margin" v-if="result">
            <p>ยอดคงเหลือ {{ batchQuantity }} {{ batchUOM }}</p>
        </div>

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
    onIonViewWillLeave,
    onIonViewDidEnter
} from "@ionic/vue"
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { frappeSDK } from "@/utils/frappeSDK";
import { updateThemeColor,setDefaultTheme } from "@/utils/themeHandle"
import { BrowserQRCodeReader } from '@zxing/browser';
const isCameraActive = ref(false)
const { db } = frappeSDK()
const result = ref<string>("");
const batchQuantity = ref("");
const batchUOM = ref("");
let codeReader: BrowserQRCodeReader;
let currentStream: MediaStream | null

const qrScan = async () => {
  codeReader = new BrowserQRCodeReader();
  try {
    const videoElement = document.getElementById("video") as HTMLVideoElement;
    const constraints = { video: { facingMode: "environment" } };
    currentStream = await navigator.mediaDevices.getUserMedia(constraints);
    videoElement.srcObject = currentStream;
    isCameraActive.value = true
    const decodeResult = await codeReader.decodeOnceFromVideoDevice(
      undefined,
      videoElement
    );
    result.value = decodeResult.getText();
  } catch (err) {
    console.error("Error scanning QR:", err);
  }
};
const getBatch = async () => {
    const [ itemCode, itemName, batchID, batchQty, resultUOM] = result.value?.split("|")
    const batchDoctype = await db.getDoc('Batch', batchID)    
    batchQuantity.value = batchDoctype.batch_qty
    batchUOM.value = batchDoctype.stock_uom
}
const stopCamera = () => {
    if(currentStream){
        currentStream.getTracks().forEach(track => track.stop())
        BrowserQRCodeReader.releaseAllStreams()
        currentStream = null;
        console.log("Camera Stop")
        isCameraActive.value = false
    }
};

const cameraStatus = () => {
	if (isCameraActive.value) {
		stopCamera()
	}
}
onMounted(async () => {
  	setDefaultTheme()
	updateThemeColor()
})

watch(result, (val) => {
    if (val) {
        getBatch()
    }
})
onIonViewDidEnter(()=> {
    qrScan();
})
onIonViewWillLeave(() => {
  cameraStatus()
})

</script>