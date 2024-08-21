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
      IonItem,
      modalController,
    } from '@ionic/vue';
    import { ref } from 'vue';
    import Input from 'frappe-ui/src/components/Input.vue';
    import { FrappeApp } from 'frappe-js-sdk';
    const docID = ref('');
    const docName = ref('')
    let dateTime = new Date()
    const frappe = new FrappeApp ('http://192.168.10.105:8001/')
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
        from_time: '11:17',
        time_in_mins: '3',
        to_time: '11:20'
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
  </script>
  <style scoped>
  .input{
    width: 100vw;
  }
  </style>