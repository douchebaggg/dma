<template>
    <ion-page>
        <ion-content :fullscreen="true">
          
          <ion-label class="ml-2">{{ t('selling.services') }}</ion-label>
          <ion-card class="m-2 pb-14 rounded-xl border-0 shadow-xs">
            <ion-accordion-group class=" m-4">
              <ion-accordion class="rounded-xl" value="first">
                <ion-item slot="header" lines="none">
                  <ion-label>Sale Order Doctype</ion-label>
                </ion-item>
                <div class="ion-padding " slot="content" v-if="saleOrderDisplay.length > 0">
                  <ul class="flex flex-col">
                  <li class="ml-5 py-2 border-b-1 border-zinc-500 flex justify-between items-center"
                  v-for="doc in saleOrderDisplay"
                  :key="doc.name" >                  
                  <span>{{ doc.customer }}</span>
                  <span>Status: {{ doc.status }}</span>
                  </li>
                  </ul>
                  <div class="flex flex-col items-center">
                    <Button 
                    class="rounded-xl ion-margin-top w-52 hover:bg-[#0070CC] bg-[#0289F7]"
                    :variant="'solid'"
                    size="md"
                    @click="closePopover()" >{{ t('selling.add') }}</Button>
                  </div>

                </div>
                <div class="ion-padding" slot="content" v-else>
                  <p class="ml-5">No Document found</p>
                </div>
              </ion-accordion>
              <ion-accordion class="rounded-xl" value="second">
                <ion-item slot="header" lines="none">
                  <ion-label>Sale Invoice Doctype</ion-label>
                </ion-item>
                <div class="ion-padding " slot="content" v-if="saleInvoiceDisplay.length > 0">
                  <ul>
                  <li class="ml-5" v-for="doc in saleInvoiceDisplay">
                    <ion-checkbox label-placement="end" justify="start">{{ doc }} 
                    </ion-checkbox>
                  </li>
                  </ul>
                </div>
                <div class="ion-padding " slot="content" v-else>
                  <p class="ml-5">No Document found</p>
                </div>
              </ion-accordion>
            </ion-accordion-group>
          </ion-card>
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
import { useI18n } from "vue-i18n"
const { t } = useI18n()
const { db } = frappeSDK()
const saleOrderDisplay = ref<any>([])
const saleInvoiceDisplay = ref<any>([])
const doctypeOptions = ref(['Testing Doctype', 'Sales Order']);
const selectedDoctype = ref(saleOrderDisplay.value[0]);
const date = ref()
const displayDoctype = async (doctype: string) => {
  const saleOrder = await db.getDocList('Sales Order',{
  fields: ['name', 'creation', 'customer','status'],
	limit: 10, 
  //filters: [['name','=','BK202409-012']],
	orderBy: { field: 'modified',order: 'desc',} 
  })
  saleOrderDisplay.value = saleOrder.map((doc:any) => {
    return {
      name: doc.name,
      customer: doc.customer,
      status: doc.status
    }
  })

  //saleInvoice
  const saleInvoice = await db.getDocList('Sales Order',{
    fields: ['name', 'creation'],
    limit: 10, 
    orderBy: { field: 'modified',order: 'desc',} 
  })
  saleInvoiceDisplay.value = saleInvoice.map(doc => doc.name)
}

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