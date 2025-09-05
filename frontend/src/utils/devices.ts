import { useI18n } from "vue-i18n"

export const setDefaultLanguage = () => {
    const { locale } = useI18n()
    const availableLanguages = [
        { value: "en", label: "English" },
        { value: "th", label: "Thai" },
    ]
	const deviceLang = navigator.language.split("-")[0]
	const savedLang = localStorage.getItem("preferredLanguage")
	const defaultLang = savedLang || (availableLanguages.some(lang => lang.value === deviceLang) ? deviceLang : "en")
	locale.value = defaultLang
	localStorage.setItem("preferredLanguage", defaultLang)
	console.log(locale.value)
	if(localStorage.getItem("preferredLanguage") === "th"){
		locale.value = "th"
	}
	else{
		locale.value= "en"
	}
}
