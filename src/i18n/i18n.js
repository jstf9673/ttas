import Vue from 'vue';
import VueI18n from 'vue-i18n';
import {Locale} from 'vant'
import enUS from 'vant/lib/locale/lang/en-US';
import zhCN from 'vant/lib/locale/lang/zh-CN';
import jaJP from 'vant/lib/locale/lang/ja-JP';

import en from './lang/en';
import zh from './lang/zh';
import ja from './lang/ja';

Vue.use(VueI18n);
let localeLang = localStorage.lang || 'en';
const messages = {
    en: {
        ...enUS,
        ...en
    },
    zh: {
        ...zhCN,
        ...zh
    },
    ja: {
        ...jaJP,
        ...ja
    }
};
const i18n = new VueI18n({
    locale: localeLang,
    messages,
    silentTranslationWarn: true
});

Locale.use(localeLang, messages[localeLang]);
export default i18n;
