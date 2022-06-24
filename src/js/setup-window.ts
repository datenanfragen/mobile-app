import { LocalNotifications } from '@capacitor/local-notifications';
import { setupWindow } from '@datenanfragen/components';

// TODO: Error handler.
let errorId = 1;
const logError = (err: ErrorEvent | PromiseRejectionEvent) => {
    if ('message' in err)
        LocalNotifications.schedule({
            notifications: [{ title: 'An error occurred', body: err.message, id: errorId++ }],
        });
    console.error('An error occurred:', err);
};
window.addEventListener('unhandledrejection', logError);
window.addEventListener('error', logError);

// Setup window for @datenanfragen/components.
(window as typeof window & { LOCALE: string }).LOCALE = 'en';
setupWindow();
