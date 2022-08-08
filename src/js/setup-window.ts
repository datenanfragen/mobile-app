import { LocalNotifications } from '@capacitor/local-notifications';
import { setupWindow, useAppStore } from '@datenanfragen/components';
import en_mobile_translations from '../i18n/en.json';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';

// TODO: Error handler.
let errorId = 1;
const errorHandler = (err: ErrorEvent | PromiseRejectionEvent) => {
    if ('message' in err)
        LocalNotifications.schedule({
            notifications: [{ title: 'An error occurred', body: err.message, id: errorId++ }],
        });
    console.error('An error occurred:', err);
};
window.addEventListener('unhandledrejection', (e) => {
    // Work around annoying Chromium bug, see: https://stackoverflow.com/q/72396527
    if ('defaultPrevented' in e && !e.defaultPrevented) errorHandler(e.reason);
});
window.addEventListener('error', errorHandler);

const translations = {
    en: en_mobile_translations,
};

setupWindow({ supported_languages: { en: undefined, de: undefined }, locale: useAppStore.getState().savedLocale });
if (process.env.NODE_ENV === 'development')
    (window as typeof window & { BASE_URL: string }).BASE_URL = 'http://localhost:1314/';

// TODO: Make this available in the settings/set it in the tutorial
if (typeof useAppStore.getState().saveRequestContent === 'undefined')
    useAppStore.getState().setPreference({ saveRequestContent: true });

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.I18N_DEFINITIONS_MOBILE = translations[useAppStore.getState().savedLocale as keyof typeof translations];

window.email = {
    setSmtpPassword: (password) =>
        SecureStoragePlugin.set({ key: 'Datenanfragen.de-smtp-password', value: password }).then(),
    getSmtpPassword: () => SecureStoragePlugin.get({ key: 'Datenanfragen.de-smtp-password' }).then((r) => r.value),
};
