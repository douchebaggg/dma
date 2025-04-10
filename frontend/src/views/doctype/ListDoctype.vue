<template>
    <ion-page>
        <ion-content :fullscreen="true">
          <div class="m-4">
          <ion-card class="mb-2 rounded-xl border-0 shadow-xs">
            <ion-accordion-group class=" m-4">
              <ion-accordion class="rounded-xl" value="first">
                <ion-item slot="header" lines="none">
                  <ion-label>Basket Doctype</ion-label>
                </ion-item>
                <div class="ion-padding" slot="content" v-if="basketDisplay.length > 0">
                  <ul>
                  <li class="ml-5" v-for="doc in basketDisplay" >{{ doc }}</li>
                  </ul>
                </div>
                <div class="ion-padding" slot="content" v-else>
                  <p class="ml-5">No Document found</p>
                </div>
              </ion-accordion>
              <ion-accordion class="rounded-xl" value="second">
                <ion-item slot="header" lines="none">
                  <ion-label>Pallet</ion-label>
                </ion-item>
                <div class="ion-padding " slot="content" v-if="palletDisplay.length > 0">
                  <ul>
                  <li class="ml-5" v-for="doc in palletDisplay">
                    <ion-checkbox label-placement="end" justify="start">{{ doc }} 
                    </ion-checkbox>
                  </li>
                  </ul>
                </div>
                <div class="ion-padding " slot="content" v-else>
                  <p class="ml-5">No Document found</p>
                </div>
              </ion-accordion>
              <ion-select aria-label="Doctype" v-model="selectedDoctype" interface="popover" placeholder="Select Basket Doctype" fill="outline"
              @ionChange="closePopover"
              >
                <ion-select-option v-for="doctype in basketDisplay" :key="doctype" :value="doctype">
                  {{ doctype }}
                </ion-select-option>
              </ion-select>
            </ion-accordion-group>
          </ion-card>
          </div>
           <!-- Dropdown for selecting Doctype -->
           
      </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonPage, 
  IonContent, 
  IonAccordion, 
  IonAccordionGroup, 
  IonItem, 
  IonLabel, 
  IonCheckbox,
  IonSelect,
  IonSelectOption,
  IonDatetime, IonDatetimeButton, IonCard
} from '@ionic/vue';
import { ref, onMounted, watch } from 'vue'
import { frappeSDK } from '@/utils/frappeSDK';
const { db } = frappeSDK()
const basketDisplay = ref<any>([])
const palletDisplay = ref<any>([])
const doctypeOptions = ref(['Testing Doctype', 'Sales Order']);
const selectedDoctype = ref(basketDisplay.value[0]);
const date = ref()
const displayDoctype = async (doctype: string) => {
  const getBasket = await db.getDocList('Testing Doctype',{
  fields: ['name', 'creation'],
	limit: 10, 
  //filters: [['name','=','BK202409-012']],
	orderBy: { field: 'modified',order: 'desc',} 
  })
  basketDisplay.value = getBasket.map(doc => doc.name)

  //pallet
  const getPallet = await db.getDocList('Sales Order',{
    fields: ['name', 'creation'],
    limit: 10, 
    orderBy: { field: 'modified',order: 'desc',} 
  })
  palletDisplay.value = getPallet.map(doc => doc.name)
}
watch(selectedDoctype, (newDoctype) => {
  displayDoctype(newDoctype);
  console.log(selectedDoctype.value);
});
onMounted(() => {
  displayDoctype(selectedDoctype.value);
})

const closePopover = () => {
  document.querySelectorAll('ion-popover').forEach((popover) => popover.dismiss());
};

</script>
<style scoped>
  ion-item{
    padding: 0;
    border: none;
    
  }

  ion-accordion {
    margin: 10px auto;
  }

  ion-accordion.accordion-collapsing ion-item[slot='header'],
  ion-accordion.accordion-collapsed ion-item[slot='header'] {
    --background: var(--ion-color-light);
    --color: var(--ion-color-light-contrast);
  }

  ion-accordion.accordion-expanding ion-item[slot='header'],
  ion-accordion.accordion-expanded ion-item[slot='header'] {
    --background: var(--ion-color-primary);
    --color: var(--ion-color-primary-contrast);
  }

</style>