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
    <ion-searchbar class="custom mt-2 mb-2" @ionInput="searchbarInput($event)"></ion-searchbar>
  </ion-header>

  <div class="ion-padding h-90 overflow-y-auto">
    <ion-list id="modal-list" :inset="true">
      <ion-item v-for="(item, index) in filteredItems" :key="item.value + '-' + index">
        <div class="flex flex-col w-full">
          <ion-checkbox 
            :value="item.value" 
            :checked="isChecked(item.value)" 
            @ionChange="checkboxChange($event)"
          >
            {{ item.text }}
          </ion-checkbox>
          <div class="flex justify-between ion-text-center max-[620px]:flex-col">
            <Input
              v-for="input in inputConfigs"
              :key="input.key"
              v-if="workingSelectedValues.includes(item.value) && inputValues[item.value]"
              v-model="inputValues[item.value][input.key as InputKey]"
              class="rounded-xl py-1 mb-2 w-16"
              type="number"
              :label="t(input.label)"
              inputmode="numeric"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
            />
          </div>
        </div>
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
import { ref, watch, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

// Input configurations
type InputKey = 'one_day' | 'incubate' | 'IT' | 'example' | 'spoil' | 'leak';

const inputConfigs: { key: InputKey; label: string }[] = [
  { key: 'one_day', label: 'basket.one_day' },
  { key: 'incubate', label: 'basket.incubate' },
  { key: 'IT', label: 'basket.IT' },
  { key: 'example', label: 'basket.example' },
  { key: 'spoil', label: 'basket.spoil' },
  { key: 'leak', label: 'basket.leak' },
];

const props = defineProps<{
  items: { value: string; text: string }[];
  selectedItems: string[];
  initialInputs?: { [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number } };
  title?: string;
}>();

const emit = defineEmits<{
  (e: 'selection-cancel'): void;
  (e: 'selection-change', payload: {
    selected: string[];
    inputs: { [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number } };
  }): void;
  (e: 'input-change', payload: {
    selected: string[];
    inputs: { [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number } };
  }): void;
}>();

const filteredItems = ref(props.items);
const workingSelectedValues = ref([...props.selectedItems]);
const inputValues = ref<{
  [key: string]: { one_day: number; incubate: number; IT: number; example: number; spoil: number; leak: number };
}>({});

onMounted(() => {
  workingSelectedValues.value.forEach((value) => {
    if (!inputValues.value[value]) {
      inputValues.value[value] = props.initialInputs?.[value] || {
        one_day: 0,
        incubate: 0,
        IT: 0,
        example: 0,
        spoil: 0,
        leak: 0,
      };
    }
  });
});

// Watch for changes in props.items
watch(() => props.items, (newItems) => {
  filteredItems.value = newItems;
}, { immediate: true });

/* for debugging
watch(filteredItems, (newItems) => {
  console.log('Filtered items changed, rendering:', newItems);
});*/

watch(
  inputValues,
  (newInputs) => {
    emit('input-change', {
      selected: workingSelectedValues.value,
      inputs: newInputs,
    });
  },
  { deep: true }
);


watch(workingSelectedValues, (newValues) => {
  newValues.forEach((value) => {
    if (!inputValues.value[value]) {
      inputValues.value[value] = props.initialInputs?.[value] || {
        one_day: 0,
        incubate: 0,
        IT: 0,
        example: 0,
        spoil: 0,
        leak: 0,
      };
    }
  });

});

const isChecked = (value: string) => {
  return workingSelectedValues.value.includes(value);
};

const cancelChanges = () => {
  inputValues.value = {};
  workingSelectedValues.value = [...props.selectedItems];
  emit('selection-cancel');
};

const confirmChanges = () => {
  emit('selection-change', {
    selected: workingSelectedValues.value,
    inputs: inputValues.value,
  });
};

const searchbarInput = (event: SearchbarCustomEvent) => {
  filterList(event.target.value);
};

const filterList = (searchQuery: string | undefined | null) => {
  if (!searchQuery) {
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
ion-searchbar.custom {
  --border-radius: 12px;
}
.dark ion-searchbar.custom {
  --background: var(--ion-color-dark);
  --border-radius: 12px;
}
</style>