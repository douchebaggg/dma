<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center">Create Doctype</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="createDoctype" :strong="true">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item lines="none">    
        <Input class="input" label="Enter Id" v-model="docID" placeholder="Enter Basket No" inputmode="numeric"  />  
      </ion-item>
      <ion-item lines="none">
        <Input class="input" label="Enter name" v-model="docName" placeholder="Enter Code" />
      </ion-item>
      <h2 class="ion-text-center ion-padding">Enter Baskets Table</h2>
      <ion-input class="time outline-none" label="Start Time" label-placement="floating" type="time" v-model="startTime"></ion-input>
      <ion-input class="time outline-none" label="Time in Minute" label-placement="floating" type="number" inputmode="numeric" v-model="timeInMins"></ion-input>
      <ion-input class="time outline-none" label="End Time" label-placement="floating" type="time" v-model="endTime"></ion-input>
    </ion-content> 
  </template>
  
  <script lang="ts" setup>
    import {
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonButton,
      IonInput,
      IonItem,
      modalController,
    } from '@ionic/vue';
    import { ref, watch } from 'vue';
    import Input from '@/components/Input.vue';
    import { FrappeApp } from 'frappe-js-sdk';

    const docID = ref('')
    const docName = ref('')
    const startTime = ref<string>('')
    const timeInMins = ref<number | any>('')
    const endTime = ref<string>('')
    let dateTime = new Date()
    const frappe = new FrappeApp ('http://erp.alzo.io:10580/')
    const db = frappe.db()

  //get date and format to yyy/mm/dd
  const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}/${month}/${day}`;
};
//create Basket Entry doctype
  const createDoctype = () => {  
      const dataTable = [
      {
        from_time: startTime.value,
        time_in_mins: timeInMins.value,
        to_time: endTime.value
      }
    ]
    db.createDoc('Basket Entry', {
      name: docName.value,
        baskets: dataTable,
        //full_name: docName.value,
        posting_date: formatDate(dateTime)
      })
  .then((doc) => console.log(doc))
  .catch((error) => console.error(error));
  modalController.dismiss(docName.value,'confirm')  
    }
    const cancel = () => modalController.dismiss(null, 'cancel');

  const timeCalculate = ():void =>{
    const [hours, minutes] = startTime.value.split(':').map(Number);
    const startDate = new Date();
    startDate.setHours(hours);
    startDate.setMinutes(minutes);
    startDate.setMinutes(startDate.getMinutes() + parseInt(timeInMins.value));
    const endHours = startDate.getHours().toString().padStart(2, '0');
    const endMinutes = startDate.getMinutes().toString().padStart(2, '0');
    endTime.value = `${endHours}:${endMinutes}`;
  }
  watch([startTime, timeInMins], timeCalculate);
  </script>
  <style scoped>
  .input{
    width: 100vw;
  }

  </style>