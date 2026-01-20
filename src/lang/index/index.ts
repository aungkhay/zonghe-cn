// import { createI18n } from "vue-i18n";
// import en from "@/lang/en";
// import portugal from "@/lang/portugal";
// import zh from "@/lang/zh";
// import { useUserStoreHook } from "@/store/modules/user";
// import {  computed } from "vue";

// const defLocale = computed(() => {
//   //return useUserStoreHook().lang || 'portugal';
//   return useUserStoreHook().lang || 'zh';
// })

// const i18n = createI18n({
//   globalInjection: true,
//   legacy: false, // 如果你不需要支持 Vue 2 的 legacy 模式
//   locale: defLocale.value, // 默认语言
//   messages: {
//     en: en,
//     portugal: portugal,
//     zh: zh
//   }
// });

// export default i18n 

import { createI18n } from "vue-i18n";
import en from "@/lang/en";
import portugal from "@/lang/portugal";
import zh from "@/lang/zh";
import Common from "@/utils/common/common";
import { get } from "node_modules/axios/index.cjs";

const UserLangKey = "__user__lang__";

// Get lang directly from localStorage or default to 'zh'
function getDefaultLocale() {
  const val = Common.getStorage(UserLangKey);
  const validLangs = ['zh', 'en', 'portugal'];
  // Always default to 'zh' if no value, invalid value, or 'en'
  if (!val || val === 'null' || val === 'undefined' || !validLangs.includes(val)) {
    return 'zh';
  }
  return val;
}

async function getDefaultLocaleIP() {
  const saved = Common.getStorage(UserLangKey);

  // If user already selected language
  if (saved && saved !== 'null' && saved !== 'undefined') {
    return saved;
  }


  // Auto-detect by IP
  try {
    const res = await fetch("https://ipwho.is/");
    const data = await res.json();
    console.log("IP Info:", data);

    if (data.country_code === "CN") {
      return "zh";
    }
  } catch (err) {
    console.error("IP detection error:", err);
  }

  return "en"; // fallback default
}

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  // locale: getDefaultLocale(),
  locale: 'zh',
  fallbackLocale: 'zh',
  messages: {
    // en,
    // portugal,
    zh
  }
});

// Resolve async default locale and update i18n after creation
// (async () => {
//   try {
//     const locale = await getDefaultLocale();
//     Common.setStorage(UserLangKey, locale);
//     // vue-i18n v9 Composer.locale is a Ref<string>, set .value when present
//     const globalLocale: any = (i18n.global as any).locale;
//     if (globalLocale && typeof globalLocale === 'object' && 'value' in globalLocale) {
//       globalLocale.value = locale;
//     } else {
//       // fallback for other runtime shapes
//       (i18n.global as any).locale = locale;
//     }
//   } catch (e) {
//     console.error('Failed to set locale:', e);
//   }
// })();

export default i18n;
