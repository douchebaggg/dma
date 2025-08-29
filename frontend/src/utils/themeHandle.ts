import { ref } from "vue";
export const DarkMode = ref(window.matchMedia('(prefers-color-scheme: dark)').matches)

export const updateThemeColor = () => {
  const themeColor = DarkMode.value ? '#222428' : '#f4f5f6';
  let metaThemeColor = document.querySelector('meta[name="theme-color"]');
  if (!metaThemeColor) {
    metaThemeColor = document.createElement('meta');
    metaThemeColor.setAttribute('name', 'theme-color');
    document.head.appendChild(metaThemeColor);
  }
  metaThemeColor.setAttribute('content', themeColor);
};

export const setDefaultTheme = () => {
	const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
		if (DarkMode.value = prefersDarkScheme.matches) {
			document.documentElement.classList.toggle('ion-palette-dark', DarkMode.value);
			localStorage.setItem("darkMode", JSON.stringify(DarkMode.value))
		} else {
			document.documentElement.classList.remove('ion-palette-dark');
			localStorage.setItem("darkMode", JSON.stringify(DarkMode.value))
		}
	};