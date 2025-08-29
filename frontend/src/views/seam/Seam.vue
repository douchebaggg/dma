<template>
  <ion-page>
      <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="" @click="router.back()"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ t('seam.seam_entry') }}</ion-title>
      </ion-toolbar>
      </ion-header>
      <ion-content>
        <h2 class="text-center text-2xl font-semibold mb-4">{{ t('seam.seam_entry') }}</h2>
      <!-- Card กรอบหลัก -->
      <ion-card class="rounded-xl m-2 pb-14 border-1 border-zinc-500 ">     
        <form @submit.prevent="onSubmit" class="ion-margin ion-padding" novalidate>
          <!-- Date & Time -->
          <div class="grid grid-cols-2 gap-4">
          <div>
            <ion-label class="">{{ t('seam.date') }}
            <ion-datetime-button class="mt-1.5" datetime="date" v-model="dateButton"></ion-datetime-button>
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime :locale="getLocal()" presentation="date" id="date" v-model="form.date" @ionChange="handleTimeChange"></ion-datetime>
            </ion-modal>
            </ion-label>
              <p v-if="errors.date" class="text-red-500 text-sm mt-2">{{ errors.date }}</p>
            </div>
            <div>
            <ion-label>{{ t('seam.time') }}
            <TextInput id="time" type="time" v-model="form.time" size="md" :class="inputClass(errors.time)" :label="t('seam.time')" /> </ion-label>
              <p v-if="errors.time" class="text-red-500 text-sm mt-2">{{ errors.time }}</p>
            </div>
          </div>
          <!-- Can Code & Number -->
          <div class="mt-4 grid grid-cols-2 md:grid-cols-2 gap-4">
            <div>
              <Input id="canCode" type="text" v-model="form.canCode" :class="inputClass(errors.canCode)" :label="t('seam.can_code')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.canCode" class="text-red-500 text-sm mt-2">{{ errors.canCode }}</p>
            </div>

            <div>
              <Input id="number" type="text" v-model="form.number" :class="inputClass(errors.number)" :label="t('seam.number')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.number" class="text-red-500 text-sm mt-2">{{ errors.number }}</p>
            </div>
          <!-- Supplier & Batch No -->
          <div>
              <Input id="supplier" type="text" v-model="form.supplier" :class="inputClass(errors.supplier)" :label="t('seam.supplier')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.supplier" class="text-red-500 text-sm mt-2">{{ errors.supplier }}</p>
            </div>
            <div>
              <Input id="batchNo" type="text" v-model="form.batchNo" :class="inputClass(null)" :label="t('seam.batch_no')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
            </div>
          </div>

        <!-- Manufacturer Select -->
          <div class="py-4">
            <label for="manufacturer" class="text-sm mt-2 font-medium block">
              
            </label>
            <ion-select
              id="manufacturer"
              v-model="seamSpec"
              class="w-full"
              interface="popover" :placeholder="t('seam.select_manufacturer')" fill="outline" >
              <ion-select-option v-for="item in seamSpecList" :key="item.idx" :value="item.name">
                {{ item.name }}
              </ion-select-option>
            </ion-select>
          </div>
          <!-- Measurement Fields -->
          <div class=" grid grid-cols-4 gap-4 text-center max-sm:grid-cols-2">
            <div v-for="field in numericFields" :key="field.name">
              <!--<label :for="field.name" class="text-sm mt-2 font-medium block">{{ field.label }}</label>-->
              <ion-label :for="field.name" class=" max-sm:text-xs">{{ field.label }}</ion-label>
              <Input
                :id="field.name"
                type="number"
                v-model.number="form[field.name]"
                :step="field.step"
                :min="field.min"
                :max="field.max"
                :placeholder="field.placeholder"
                :class="inputClass(errors[field.name])"
                style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors[field.name]" class="text-red-500 text-sm mt-2">{{ errors[field.name] }}</p>
            </div>
          </div>

          <!-- Wrinkle Rating -->
          <div class="py-4">
            <Input
              id="wrinkleRating"
              type="text"
              v-model="form.wrinkleRating"
              :class="inputClass(errors.wrinkleRating)"
              :label="t('seam.wrinkle_rating')"
              maxlength="1"
              pattern="[PpNn]"
              placeholder="P or N"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
            />
            <p v-if="errors.wrinkleRating" class="text-red-500 text-sm mt-2">{{ errors.wrinkleRating }}</p>
          </div>

          <!-- Comment -->
          <div class="mt-2">
            <!--<textarea id="comment" v-model="form.comment" class="w-full border rounded px-3 py-2 resize-none"></textarea>-->
            <ion-textarea id="comment" class="rounded-xl py-1 h-20 mb-2" :label="t('seam.comment')" fill="outline" v-model="form.comment"
            label-placement="stacked">
            </ion-textarea>
          </div>

          <!-- Buttons -->
          <div class="flex justify-center space-x-5 ion-margin-top">
            <Button 
              class="rounded-lg  text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
              @click="onSubmit"
              size="md"> {{ t("button.Save") }}</Button>
            <Button
            class="rounded-lg text-white hover:bg-red-800 bg-red-700 w-20"
            :variant="'solid'"
            @click="onCancel"
            size="md" >{{ t("button.Cancel") }}</Button>
		      </div>

          <!-- Submitted Preview -->
          <transition name="fade" mode="out-in">
            <div v-if="submitted" class="mt-6 p-4 border rounded bg-green-50 text-green-700">
              <h3 class="font-semibold mb-2">{{ t('seam.form_data') }}</h3>
              <pre class="whitespace-pre-wrap text-sm mt-2">{{ JSON.stringify(form, null, 2) }}</pre>
            </div>
          </transition>
        </form>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonToolbar, IonButtons, IonBackButton, 
IonTitle, IonCard, IonHeader,IonLabel,
IonSelect,IonSelectOption,IonDatetime,IonDatetimeButton,IonTextarea,IonModal
} from '@ionic/vue'
import { frappeSDK } from '@/utils/frappeSDK'
import { useI18n } from 'vue-i18n'
import { TextInput } from 'frappe-ui/src/components/TextInput'
const seamSpecList = ref<any>([])
const seamSpec = ref(seamSpecList.value[0])
const dateButton = ref<any>(null)
const getCurrentTime = () => {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
const time = ref<any>(getCurrentTime())
const router = useRouter()
const { t } = useI18n()
const submitted = ref(false)
const errors = reactive<any>({})
const { db } = frappeSDK()

// Form
const form = reactive<any>({
  date: new Date().toISOString().substring(0, 10),
  time: time,
  canCode: '',
  number: '',
  supplier: '',
  batchNo: '',
  manufacturer: seamSpec.value,
  countersinkDepth: null,
  seamLength: null,
  seamThickness: null,
  bodyHook: null,
  coverHook: null,
  actualOverlap: null,
  percentOverlap: null,
  wrinkleRating: '',
  percentBodyHookButting: null,
  comment: '',
})
const numericFields = reactive<any[]>([
  { name: 'countersinkDepth', label: t('seam.countersink_depth'), placeholder: '-', step: 0.01, min: 4.65, max: 5.00 },
  { name: 'seamLength', label: t('seam.seam_length'), placeholder: '-', step: 0.01, min: 2.90, max: 5.20 },
  { name: 'seamThickness', label: t('seam.seam_thickness'), placeholder: '-', step: 0.01, min: 1.05, max: 1.25 },
  { name: 'bodyHook', label: t('seam.body_hook'), placeholder: '-', step: 0.01, min: 2.00, max: 2.50 },
  { name: 'coverHook', label: t('seam.cover_hook'), placeholder: '-', step: 0.01, min: 1.85, max: 2.15 },
  { name: 'actualOverlap', label: t('seam.actual_overlap'), placeholder: '-', step: 0.01, min: 1.02 },
  { name: 'percentOverlap', label: `% ${t('seam.percent_overlap')}`, placeholder: '-', step: 0.1, min: 45 },
  { name: 'percentBodyHookButting', label: `% ${t('seam.percent_body_hook_butting')}`, placeholder: '-', step: 0.1, min: 70 },
])

// Input Class
const inputClass = (error: any) =>
  `w-full rounded-lg py-1 focus:outline-none focus:ring-2 ${
    error ? '' : 'border-gray-300 focus:ring-indigo-500'
  }`

// Get Seam Spec Doctype  
const getSeamSpec = async () => {
  const allSeamSpec = await db.getDocList('Seam Specification',{
    fields: ['*'],
		orderBy: { field: 'modified',order: 'asc',},
    limit: 50, 
  })
  seamSpecList.value = allSeamSpec
  console.log(allSeamSpec)
}

// Submit
const  onSubmit = async () => {
  errors.date = !form.date ? t('seam.required_field') : ''
  errors.time = !form.time ? t('seam.required_field') : ''
  errors.canCode = !form.canCode ? t('seam.required_field') : ''
  errors.number = !form.number ? t('seam.required_field') : ''
  errors.supplier = !form.supplier ? t('seam.required_field') : ''
  errors.wrinkleRating = !/^[PpNn]$/.test(form.wrinkleRating) ? `${t('seam.wrinkle_rating')} (P/N)` : ''

  numericFields.forEach((field) => {
    const value = form[field.name]
    if (value === null || value === '' || isNaN(value)) {
      errors[field.name] = `${field.label} ${t('seam.required_field')}`
    } else if (field.min !== undefined && value < field.min) {
      errors[field.name] = `${field.label} ≥ ${field.min}`
    } else if (field.max !== undefined && value > field.max) {
      errors[field.name] = `${field.label} ≤ ${field.max}`
    } else {
      errors[field.name] = ''
    }
  })
  if (Object.values(errors).some((e) => e)) return
  submitted.value = true
  /*try {
    const doc = await db.createDoc('Double Seam Can Inspection', {
      can_code: form.canCode,
      date: form.date,
      seamer_no: form.number,
      quality_control_report: [
        {
          doctype: 'Quality Control Report',
          countersink_depth_cd: form.countersinkDepth,
        },
      ],
    })
    console.log('Create doctype success', doc)
  } catch (error) {
    console.error('Cannot create doctype', error)
  }*/

  //alert(t('seam.form_submitted'))
}
// Cancel
const onCancel = () =>  {
  Object.keys(form).forEach((key: any) => {
    form[key] = typeof form[key] === 'number' ? null : ''
  })
  submitted.value = false
  Object.keys(errors).forEach((key) => (errors[key] = ''))
}
const getLocal = () => {
	const local = localStorage.getItem('preferredLanguage');
	if (local === 'th') {
		return 'th-TH'
	}
	else {
		return 'en-GB'
	}
}
const parseRange = (rangeStr: string | null, isPercent = false) => {
   if (!rangeStr) return { min: undefined, max: undefined, placeholder: "" }
     if (rangeStr.includes("-")) {
    const [minStr, maxStr] = rangeStr.split("-").map(s => s.trim())
    return {
      min: Number(minStr),
      max: Number(maxStr),
      placeholder: `${minStr} - ${maxStr}`
    }
  }
  return {
    min: Number(rangeStr),
    max: undefined,
    placeholder: isPercent ? `≥ ${rangeStr}%` : `≥ ${rangeStr}`
  }
}
const handleTimeChange = (ev:any) => {
  const value = ev.detail.value; 
  if (value) {
    const d = new Date(value);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    time.value = `${hh}:${mm}`;
  } else {
    time.value = null;
  }
}
//on mounted
onMounted(() => {
  getSeamSpec()
});
// watch to change placeholder and min,max of number
watch(seamSpec, (newValue) => {
  form.manufacturer = newValue

  const selectedSpec = seamSpecList.value.find((item:any) => item.name === newValue)
  if (!selectedSpec) return

  numericFields.splice(0, numericFields.length,
    {
      name: 'countersinkDepth',
      label: t('seam.countersink_depth'),
      ...parseRange(selectedSpec.df_cd)
    },
    {
      name: 'seamLength',
      label: t('seam.seam_length'),
      ...parseRange(selectedSpec.df_sl)
    },
    {
      name: 'seamThickness',
      label: t('seam.seam_thickness'),
      ...parseRange(selectedSpec.df_st)
    },
    {
      name: 'bodyHook',
      label: t('seam.body_hook'),
      ...parseRange(selectedSpec.df_bh)
    },
    {
      name: 'coverHook',
      label: t('seam.cover_hook'),
      ...parseRange(selectedSpec.df_ch)
    },
    {
      name: 'actualOverlap',
      label: t('seam.actual_overlap'),
      ...parseRange(selectedSpec.df_actual)  
    },
    {
      name: 'percentOverlap',
      label: `% ${t('seam.percent_overlap')}`,
      ...parseRange(selectedSpec.df_ol, true)    
    },
    {
      name: 'percentBodyHookButting',
      label: `% ${t('seam.percent_body_hook_butting')}`,
      ...parseRange(selectedSpec.df_bh_percent, true)
    }
  )
})
</script>