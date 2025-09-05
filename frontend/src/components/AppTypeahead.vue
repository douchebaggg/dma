<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="secondary" @click="cancelChanges()">{{ t('button.Cancel') }}</ion-button>
        </ion-buttons>
        <ion-title class="ion-text-center text-base font-bold">{{ title }}</ion-title>
        <ion-buttons slot="end">
          <ion-button color="secondary" @click="confirmChanges()">{{ t('button.Ok') }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
        <ion-searchbar class="custom-search mt-2 mb-2" @ionInput="searchbarInput($event)"></ion-searchbar>

    </ion-header>
  
    <div class="ion-padding h-90 overflow-y-auto">
      <ion-list id="modal-list" :inset="true">
        <ion-item v-for="(item, index) in filteredItems" :key="item.value + '-' + index">
          <ion-checkbox 
            :value="item.value" 
            :checked="isChecked(item.value)" 
            @ionChange="checkboxChange($event)"
          >{{ item.text }}</ion-checkbox>
        </ion-item>
        <ion-item v-if="filteredItems.length === 0">
            <ion-label class="ion-text-center">
                {{ t('labels.no_item') }}
            </ion-label>
        </ion-item>
      </ion-list>
    </div>
</template>
  
  <script setup lang="ts">
  import {
    IonButton, IonButtons, IonCheckbox, IonLabel, IonHeader,
    IonItem, IonList, IonTitle, IonSearchbar, IonToolbar,
  } from '@ionic/vue';
  import type { CheckboxCustomEvent, SearchbarCustomEvent } from '@ionic/vue';
  import { ref, watch } from 'vue';
  import { useI18n } from 'vue-i18n';
  const { t } = useI18n();
  const props = defineProps<{
    items: { value: string; text: string }[];
    selectedItems: string[];
    title?: any;
  }>();
  
  const emit = defineEmits<{
    (e: 'selection-cancel'): void;
    (e: 'selection-change', values: string[]): void;
  }>();
  
  const filteredItems = ref(props.items);
  const workingSelectedValues = ref([...props.selectedItems]);
  
  watch(() => props.items, (newItems) => {
    filteredItems.value = newItems;
  }, { immediate: true });
  
  watch(filteredItems, (newItems) => {
    console.log('Filtered items changed, rendering:', newItems);
  });
  
  const isChecked = (value: string) => {
    return workingSelectedValues.value.includes(value);
  };
  
  const cancelChanges = () => {
    emit('selection-cancel');
  };
  
  const confirmChanges = () => {
    emit('selection-change', workingSelectedValues.value);
  };
  
  const searchbarInput = (event: SearchbarCustomEvent) => {
    filterList(event.target.value);
  };
  
  const filterList = (searchQuery: string | undefined | any) => {
    if (searchQuery === undefined || searchQuery === '') {
      filteredItems.value = [...props.items];
    } else {
      const normalizedQuery = searchQuery.toLowerCase();
      filteredItems.value = props.items.filter((item) =>
        item.text.toLowerCase().includes(normalizedQuery)
      );
    }
  };
  
  const checkboxChange = (event: CheckboxCustomEvent) => {
    const { checked, value } = event.detail;
    if (checked) {
      workingSelectedValues.value = [...workingSelectedValues.value, value];
    } else {
      workingSelectedValues.value = workingSelectedValues.value.filter((item) => item !== value);
    }
  };
</script>

<style scoped>
ion-searchbar.custom-search {
  --border-radius: 12px;
}
.ion-palette-dark ion-searchbar.custom-search {
  --background: var(--ion-color-dark-shade);
  --border-radius: 12px;
}
.ion-palette-dark ion-checkbox::part(container) {
  border: 1px solid var(--ion-color-dark-tint);
  --checkbox-background-checked: var(--ion-color-light);
  --checkmark-width: 5px;
  --checkmark-color: var(--color-black)
}
</style>