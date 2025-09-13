
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
        <div class="ion-margin ion-padding" novalidate>
          <!-- Date & Time -->
          <div class="grid grid-cols-2 gap-4">
          <div>
            <ion-label class="text-sm">{{ t('seam.date') }}
            <ion-datetime-button class="mt-1.5" datetime="date" v-model="dateButton"></ion-datetime-button>
            <ion-modal :keep-contents-mounted="true">
              <ion-datetime :locale="getLocal()" presentation="date" id="date" v-model="dateValue" @ionChange="handleTimeChange"></ion-datetime>
            </ion-modal>
            </ion-label>
              <p v-if="errors.date" class="text-red-500 text-sm mt-2">{{ errors.date }}</p>
            </div>
            <div>
            <ion-label class="text-sm">{{ t('seam.time') }}
            <TextInput id="time" type="time" v-model="form.time" size="md" :class="inputClass(errors.time)" :label="t('seam.time')" /> </ion-label>
              <p v-if="errors.time" class="text-red-500 text-sm mt-2">{{ errors.time }}</p>
            </div>
          </div>
          <!-- Can Code & Number -->
          <div class="mt-4 grid grid-cols-2 max-sm:grid-cols-2 gap-4">
            <div>
              <span class="mb-2 block text-sm leading-4">{{ t('seam.can_code') }}</span>
              <Select id="select" v-model="canCodeSelect" size="md" :class="inputClass(errors.canCode)"
              :options="processList" /> 
              <p v-if="errors.canCode" class="text-red-500 text-sm mt-2">{{ errors.canCode }}</p>
            </div>

            <div>
               <span class="mb-2 block text-sm leading-4">{{ t('seam.number') }}</span>
              <Select id="select" type="text" v-model="selectSeamNo" size="md" :class="inputClass(errors.number)"
              :options="seamerList" />
              <p v-if="errors.number" class="text-red-500 text-sm mt-2">{{ errors.number }}</p>
            </div>

          </div>
         <div class="mt-3">
              <Input id="batchNo" type="text" v-model="form.batchNo" :class="inputClass(null)" :label="t('seam.batch_no')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
          </div>
                  <!-- seamSpecification Select -->
          <div class="py-3">
            <ion-select
              id="seamSpecification"
              v-model="seamSpec"
              class="w-full"
              interface="popover" :placeholder="t('seam.select_seam')" fill="outline" >
              <ion-select-option v-for="item in seamSpecList" :key="item.idx" :value="item.name">
                {{ item.name }}
              </ion-select-option>
            </ion-select>
          </div>
          <div>
              <Input id="supplier" type="text" v-model="form.supplier" :class="inputClass(errors.supplier)" :label="t('seam.supplier')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.supplier" class="text-red-500 text-sm mt-2">{{ errors.supplier }}</p>
          </div>
        <!-- Can size DIA & height TB TE-->  
          <div class="mt-3 grid grid-cols-4 gap-3 max-sm:grid-cols-2">
          <div>
              <Input id="supplier" type="text" v-model="form.canSize" :class="inputClass(errors.supplier)" :label="t('seam.can_size')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.supplier" class="text-red-500 text-sm mt-2">{{ errors.supplier }}</p>
          </div>
          <div>
              <Input id="batchNo" type="text" v-model="form.canDIA" :class="inputClass(null)" :label="t('seam.can_dia')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
          </div>
          <div>
              <Input id="supplier" type="text" v-model="form.tb" :class="inputClass(errors.supplier)" :label="t('seam.tb')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
              <p v-if="errors.supplier" class="text-red-500 text-sm mt-2">{{ errors.supplier }}</p>
          </div>
          <div>
              <Input id="batchNo" type="text" v-model="form.te" :class="inputClass(null)" :label="t('seam.te')"
              style="outline: none; padding-left: 1rem; border: solid 1px grey;"
              />
          </div>
          </div>

          <!-- Measurement Fields -->
           <h2 class="text-center">{{ t('seam.seam_enter') }}</h2>
          <div class=" grid grid-cols-4 gap-4 text-center max-sm:grid-cols-2">
            <div v-for="field in numericFields" :key="field.name">
              <ion-label :for="field.name" class="max-sm:text-xs">
                {{ field.label }}
              </ion-label>
              <div v-if="!['actualOverlap','percentOverlap','percentBodyHookButting'].includes(field.name)">
                <Input
                  :id="field.name"
                  type="number"
                  v-model.number="form[field.name]"
                  :step="field.step"
                  :min="field.min"
                  :max="field.max"
                  :placeholder="field.placeholder"
                  :class="inputClass(errors[field.name])"
                  style="outline:none; padding-left:1rem; border:solid 1px grey;"
                />
                <p v-if="errors[field.name]" class="text-red-500 text-sm mt-2">
                  {{ errors[field.name] }}
                </p>
              </div>
              <Input
                v-else
                :id="field.name"
                type="number"
                disabled
                :placeholder="field.placeholder"
                :value="getComputedValue(field.name)"
                :class="inputClass(null)"
                style="outline:none; padding-left:1rem; border:solid 1px grey;"
              />
            </div>
          </div>

          <!-- Wrinkle Rating -->
          <div class="py-4">
            <ion-label class="mb-1 block text-sm">{{ t('seam.wrinkle_rating') }}</ion-label>
            <ion-select
              id="wrinkleRating"
              v-model="form.wrinkleRating"
              interface="popover"
              placeholder="Select P or N"
              fill="outline"
            >
              <ion-select-option value="P">P</ion-select-option>
              <ion-select-option value="N">N</ion-select-option>
            </ion-select>
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
              class=" rounded-lg  text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
              @click="onSubmit"
              size="md"> {{ t("button.Save") }}</Button>
            <Button 
              class=" rounded-lg  text-white hover:bg-[#383838] bg-[#171717] w-20"
              :variant="'solid'"
              @click="seamPrint(seamDocname,t)"
              size="md">{{ t("button.Print") }}</Button>
            <Button
              class=" rounded-lg text-white hover:bg-red-800 bg-red-700 w-20"
              :variant="'solid'"
              @click="onCancel"
              size="md" >{{ t("button.Cancel") }}</Button>
         </div>
          <ion-modal :is-open="showModal" backdrop-dismiss="false" animated="true">
            <LoadingToSuccess 
            v-model="showModal"
            @confirmed="clearNumericFields"  
            ref="loadingSuccessRef" />
          </ion-modal>
          <!-- Submitted Preview -->
          <transition name="fade" mode="out-in">
            <div v-if="submitted" class="mt-6 p-4 border rounded bg-green-50 text-green-700">
              <h3 class="font-semibold mb-2">{{ t('seam.form_data') }}</h3>
              <pre class="whitespace-pre-wrap text-sm mt-2">{{ JSON.stringify(form, null, 2) }}</pre>
            </div>
          </transition>
        </div>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { IonPage, IonContent, IonToolbar, IonButtons, IonBackButton, 
IonTitle, IonCard, IonHeader,IonLabel,
IonSelect,IonSelectOption,IonDatetime,IonDatetimeButton,IonTextarea,IonModal
} from '@ionic/vue'
import { frappeSDK } from '@/utils/frappeSDK'
import { useI18n } from 'vue-i18n'
import { TextInput } from 'frappe-ui/src/components/TextInput'
import Select from 'frappe-ui/src/components/Select/Select.vue'
import { seamerList } from './seamerList'
import LoadingToSuccess from "@/components/LoadingToSuccess.vue"
import { seamPrint } from '@/utils/printFormat'
const seamSpecList = ref<any>([])
const seamSpec = ref(seamSpecList.value[0])
const selectSeamNo = ref<string>('')
const dateButton = ref<any>(null)
const processList = ref<any>([])
const canCodeSelect = ref(processList.value[0])
const dateValue = ref<any>(null)
let defaultQC = ref({})
let checkDoubleSeamDoc = false
let description = ''
const showModal = ref(false)
const seamDocname = ref<string>('')
let disablePrint = ref(true)
const loadingSuccessRef = ref<InstanceType<typeof LoadingToSuccess> | null>(null)
const getCurrentTime = () => {
const d = new Date();
const hh = String(d.getHours()).padStart(2, "0");
const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}
const getDate = computed(() => {
	if(dateValue.value === undefined ){ 
		const today = new Date().toISOString().split("T")[0];
		return today;
	}
	else {
		return dateValue.value ? dateValue.value.split("T")[0] : "";
	}

});
const time = ref<any>(getCurrentTime())
const router = useRouter()
const { t } = useI18n()
const submitted = ref(false)
const errors = reactive<any>({})
const { db } = frappeSDK()


// Form
const form = reactive<any>({
  get date() {
    return getDate.value
  },
  set date(val: string) {
    dateValue.value = val
  },
  time: time,
  canCode: canCodeSelect.value,
  number: '',
  supplier: '',
  batchNo: '',
  seamSpecification: seamSpec.value,
  canSize: '',
  canDIA : '',
  tb: null,
  te: null,
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
  { name: 'countersinkDepth', label: t('seam.countersink_depth'), placeholder: '-',},
  { name: 'seamLength', label: t('seam.seam_length'), placeholder: '-', },
  { name: 'seamThickness', label: t('seam.seam_thickness'), placeholder: '-',},
  { name: 'bodyHook', label: t('seam.body_hook'), placeholder: '-', },
  { name: 'coverHook', label: t('seam.cover_hook'), placeholder: '-', },
  { name: 'actualOverlap', label: t('seam.actual_overlap'), placeholder: '-',},
  { name: 'percentOverlap', label: `% ${t('seam.percent_overlap')}`, placeholder: '-', },
  { name: 'percentBodyHookButting', label: `% ${t('seam.percent_body_hook_butting')}`, placeholder: '-',},
])

// Input Class
const inputClass = (error: any) =>
  `w-full rounded-lg py-1 focus:outline-none focus:ring-2 ${
    error ? '' : 'border-gray-300 focus:ring-indigo-500'
  }`

// Get Process order
const getProcessOrder = async () => {
  	const getProcessOrder = await db.getDocList('Process Order',{
		fields: ['name','process_name', 'dsi', 'qty','material_transferred_for_manufacturing','produced_qty'],
		limit: 10, 
    	filters: [['custom_actual_start_date','=', getDate.value],['status','=','In Process']],
		orderBy: { field: 'modified',order: 'desc',} 
  })
  processList.value = getProcessOrder.map(item => ({
    ...item,
    label: item.process_name, 
    value: `${item.name}|${item.process_name}|${item.dsi}`
  }))
  //console.log(processList.value)
}

// Get Seam Spec Doctype  
const getSeamSpec = async () => {
  const allSeamSpec = await db.getDocList('Seam Specification',{
    fields: ['*'],
		orderBy: { field: 'modified',order: 'asc',},
    limit: 50, 
  })
  seamSpecList.value = allSeamSpec
  //console.log(seamSpecList.value)
}
// Submit
const  onSubmit = async () => {
  /*errors.date = !form.date ? t('seam.required_field') : ''
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
  
  if (Object.values(errors).some((e) => e)) return */
  try {
    //split value from canCode to get PO docname, can code, double seam docname
    const [processDocName,canCode,dsiName] = form.canCode.split("|"); 
    const processItem = processList.value.find((p:any) => p.process_name.trim() === canCode.trim());
    if(checkDoubleSeamDoc === true) {
      const doc = await db.createDoc('Double Seam Can Inspection', {
      //Main Field
      can_code: canCode,
      date: form.date,
      seamer_no: form.number,
      seam_specification: form.seamSpecification,
      size_of_can: form.canSize,
      dia_and_height_of_can: form.canDIA,
      tb: form.tb,
      te: form.te,
      supplier: form.supplier,
      //Seam Workder Table
      work_order: [{
        process_order: processDocName,
        item: canCode,
        description: description,
        qty: processItem?.qty,
        material_transferred_for_manufacturing: processItem?.material_transferred_for_manufacturing,
        produced_qty: processItem?.produced_qty
      }],
      //Default Quality Control Table
      default_qc: [defaultQC.value],
      // QC Table
      quality_control_report: [
      {
        doctype: 'Quality Control Report',
        countersink_depth_cd: form.countersinkDepth,
        seam_length_sl: form.seamLength,
        sea_thinckness_st: form.seamThickness,
        body_hook_bh: form.bodyHook,
        cover_hook_ch: form.coverHook,
        actual_overlab: form.actualOverlap,
        overlab_ol: form.percentOverlap,
        body_hook_butting_bh: form.percentBodyHookButting,
        comment: form.comment,
        wrinkle_rating: form.wrinkleRating,
      },
    ],

    })
    console.log('Create doctype success', doc)

    const updatePO = await db.updateDoc('Process Order',processDocName,{
      dsi: doc.name
    });
    console.log("Process Order Updated",updatePO)
    seamDocname.value = doc.name
    if(doc.quality_control_report.length > 0) {
        showModal.value = true
        await new Promise((resolve) => setTimeout(resolve, 50))
        loadingSuccessRef.value?.showAnimation()  
    }
    } else {
      const getDsi = await db.getDoc('Double Seam Can Inspection',dsiName)
      const qcTable = getDsi.quality_control_report || []
      const currentData = (getDsi.quality_control_report || []).length
      seamDocname.value = dsiName
      qcTable.push({
        countersink_depth_cd: form.countersinkDepth,
        seam_length_sl: form.seamLength,
        sea_thinckness_st: form.seamThickness,
        body_hook_bh: form.bodyHook,
        cover_hook_ch: form.coverHook,
        actual_overlab: form.actualOverlap,
        overlab_ol: form.percentOverlap,
        body_hook_butting_bh: form.percentBodyHookButting,
        comment: form.comment,
        wrinkle_rating: form.wrinkleRating,
      })
      const updateDsi = await db.updateDoc('Double Seam Can Inspection',dsiName,{
        quality_control_report: qcTable
      })
      const updateData = (updateDsi.quality_control_report || []).length
      if(updateData > currentData){
        //show modal
          showModal.value = true
          await new Promise((resolve) => setTimeout(resolve, 50))
          loadingSuccessRef.value?.showAnimation()
      }
      submitted.value = true
    }
  } catch (error) {
    console.error('Cannot create doctype', error)
  }
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
      min: parseFloat(minStr),
      max: parseFloat(maxStr),
      step: 0.01,
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
const clearNumericFields = () => {
  numericFields.forEach(({ name }) => {
    if (name in form) {
      form[name] = null
    }
  })
}
//compute calculate  
const actualOverlapComputed = computed(() => {
  if (
    form.bodyHook != null &&
    form.coverHook != null &&
    form.seamThickness != null
  ) {
    return +(form.coverHook + form.bodyHook + (1.1 * Number(form.te)) - form.seamLength).toFixed(2)
  }
  return null
})

const percentOverlapComputed = computed(() => {
  const x = form.bodyHook + form.coverHook + 1.1 * Number(form.te) - form.seamLength;
  const y = form.seamLength - (2.2 * Number(form.te) + 1.1 * Number(form.tb));
  if (
    actualOverlapComputed.value != null &&
    form.bodyHook != null &&
    form.coverHook != null
  ) {
    return +(Math.round((x / y) * 100))
  }
  return null
})

const percentBodyHookButtingComputed = computed(() => {
  const num1 = form.bodyHook - 1.1 * Number(form.tb);
  const num2 = form.seamLength - (2.2 * Number(form.te) + 1.1 * Number(form.tb));
  if (actualOverlapComputed.value != null && form.seamThickness) {
    return +(Math.round((num1 / num2) * 100))
  }
  return null
})

const getComputedValue = (name: string) => {
  switch (name) {
    case 'actualOverlap': return actualOverlapComputed.value
    case 'percentOverlap': return percentOverlapComputed.value
    case 'percentBodyHookButting': return percentBodyHookButtingComputed.value
    default: return ''
  }
}
//on mounted
onMounted(() => {
  getSeamSpec()
});

//watch date selector 
watch(dateValue, (newDate) => {
  if (newDate) {
    getProcessOrder()
    getLocal()
  }
});
watch(canCodeSelect, async (newValue) => {    
  if (!newValue || typeof newValue !== "string") {
    return
  }
  const [processDocname, processName] = newValue.split("|")
  try {
    const getItem = await db.getDoc('Item', processName)
    const getDsi = await db.getDoc('Process Order', processDocname)
    description = getItem.description
    form.canCode = newValue
    if (!getDsi.dsi) {
      checkDoubleSeamDoc = true
      console.log(checkDoubleSeamDoc,"dsi field is :", getDsi.dsi, "need to update" )
    }
  } catch (err) {
    console.error("Error fetching process/order:", err)
  }
})
watch(selectSeamNo, (val) => {
  form.number = val
  console.log("Seam No is",form.number)
})
// watch to change placeholder and min,max of number
watch(seamSpec, (newValue) => {
  form.seamSpecification = newValue
  const selectedSpec = seamSpecList.value.find((item:any) => item.name === newValue)
  if (!selectedSpec) return
  form.tb = selectedSpec.tb
  form.te = selectedSpec.te
  form.canSize = selectedSpec.can_size_oz
  form.canDIA = selectedSpec.can_size
  form.supplier = selectedSpec.supplier
  defaultQC.value = selectedSpec
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
    clearNumericFields()
})
// set value of after compute
watch(
  [actualOverlapComputed, percentOverlapComputed, percentBodyHookButtingComputed],
  ([actual, percentOL, percentBH]) => {
    form.actualOverlap = actual
    form.percentOverlap = percentOL
    form.percentBodyHookButting = percentBH

    //compare with the default and set wrinkle
    const actualDefault = numericFields.find(f => f.name === 'actualOverlap')?.min
    const overlapDefault = numericFields.find(f => f.name === 'percentOverlap')?.min
    const bhbDefault = numericFields.find(f => f.name === 'percentBodyHookButting')?.min

    const actualOverLap = actualOverlapComputed.value
    const overlap = percentOverlapComputed.value
    const bhb = percentBodyHookButtingComputed.value

    if (
      actualOverLap != null &&
      overlap != null &&
      bhb != null &&
      actualDefault != null &&
      overlapDefault != null &&
      bhbDefault != null
    ) {
      if (actualOverLap >= actualDefault && overlap >= overlapDefault && bhb >= bhbDefault) {
        form.wrinkleRating = "P"
      } else {
        form.wrinkleRating = "N"
      }
    } else {
      form.wrinkleRating = null
    }
  },
  { immediate: true }
)
watch(seamSpecList, (newList) => {
  if (newList.length > 0) {
    seamSpec.value = newList[0]
  }
})

watch(processList, (newList) => {
  if (newList.length > 0) {
    canCodeSelect.value = newList[0]
  }
})

</script>