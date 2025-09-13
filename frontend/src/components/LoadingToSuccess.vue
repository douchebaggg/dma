<template>
	<div class="flex flex-col items-center justify-center m-4">
		<DotLottieVue
			v-if="isLoading"
			src="/assets/dma/frontend/lottie/Success.lottie"
			autoplay
			:loop="false"
			style="width: 64px; height: 64px"
		/>
		<div v-if="isSuccess" class="flex flex-col items-center space-y-4">
			<h2 class="text-xl font-semibold">{{ t('labels.save_sucess') }}</h2>
			<p>{{ t('labels.save_sub_header') }}</p>
			<Button
				class="rounded-xl text-white hover:bg-blue-700 bg-blue-500 w-20"
				:variant="'solid'"
				@click="closeModal"
				size="md"
			>
				{{ t("button.Ok") }}
			</Button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useI18n } from "vue-i18n"
import { DotLottieVue } from "@lottiefiles/dotlottie-vue"

const { t } = useI18n()


const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void
  (e: "confirmed"): void
}>()

const isLoading = ref(false)
const isSuccess = ref(false)

const showAnimation = async () => {
  try {
    isLoading.value = true
    isSuccess.value = false
    emit("update:modelValue", true) 

    setTimeout(() => {
      isSuccess.value = true
      isLoading.value = false
    }, 1500)
  } catch (err) {
    console.error(err)
    emit("update:modelValue", false)
  }
}

const closeModal = () => {
  emit("update:modelValue", false)
  emit("confirmed")
}

defineExpose({ showAnimation })
</script>