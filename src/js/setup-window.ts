import { LocalNotifications } from '@capacitor/local-notifications';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import {
    getGeneratedMessage,
    getNameFromMesssage,
    setupWindow,
    t,
    t_a,
    useAppStore,
    useProceedingsStore,
    setupWindowForApp,
} from '@datenanfragen/components';
import { Email } from '../plugins/email';
import { useAppSettingsStore } from './store/settings';

// TODO: Error handler.
let notificationId = 1;
const errorHandler = (err: ErrorEvent | PromiseRejectionEvent) => {
    if ('message' in err)
        LocalNotifications.schedule({
            notifications: [{ title: 'An error occurred', body: err.message, id: notificationId++ }],
        });
    console.error('An error occurred:', err);
};
window.addEventListener('unhandledrejection', (e) => {
    // Work around annoying Chromium bug, see: https://stackoverflow.com/q/72396527
    if ('defaultPrevented' in e && !e.defaultPrevented) errorHandler(e.reason);
});
window.addEventListener('error', errorHandler);

setupWindow({ supported_languages: { en: undefined, de: undefined }, locale: useAppStore.getState().savedLocale });
setupWindowForApp(useAppStore.getState().savedLocale);
if (process.env.NODE_ENV === 'development')
    (window as typeof window & { BASE_URL: string }).BASE_URL = 'http://localhost:1314/';

// TODO: Make this available in the settings/set it in the tutorial
if (typeof useAppStore.getState().saveRequestContent === 'undefined')
    useAppStore.getState().setPreference({ saveRequestContent: true });

const isValidProtocol = (protocol: string): protocol is 'imap' | 'smtp' => ['imap', 'smtp'].includes(protocol);
window.email = {
    setEmailAccountPassword: async (protocol, password) => {
        if (isValidProtocol(protocol))
            return void SecureStoragePlugin.set({ key: `Datenanfragen.de-${protocol}-password`, value: password });
    },
    getEmailAccountPassword: async (protocol) => {
        if (isValidProtocol(protocol))
            return SecureStoragePlugin.get({ key: `Datenanfragen.de-${protocol}-password` })
                .then((r) => r.value)
                .catch((e) => {
                    if (e.message === 'Item with given key does not exist') return '';
                    else throw e;
                });
        return '';
    },

    verifyConnection: () => Email.verifyConnection().then((r) => r.valid),
    sendMessage: (options) => Email.sendMessage(options),
};

window.ON_PROCEEDING_STATUS_CHANGE = (proceeding) => {
    if (!useAppSettingsStore.getState().receiveNotifications) return;

    if (proceeding.status === 'overdue') {
        const originalRequest = getGeneratedMessage(proceeding, 'request')!;
        const summaryLine = t('request-summary-line', 'my-requests', {
            type: t(originalRequest.type, 'my-requests'),
            recipient: getNameFromMesssage(originalRequest) || '',
            date: originalRequest.date.toLocaleDateString(undefined, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            }),
            reference: proceeding.reference,
        });

        LocalNotifications.schedule({
            notifications: [
                {
                    title: summaryLine,
                    body: t_a('overdue-notification-body-short', 'proceedings'),
                    largeBody: t_a('overdue-notification-body', 'proceedings'),
                    id: notificationId++,
                },
            ],
        });
    }
};
