import create from 'zustand';
import { persist } from 'zustand/middleware';
import { Email, EmailAccountSettings } from '../../plugins/email';

type AppSettingsState = {
    showTutorial: boolean;
    emailAccountSettings: Omit<EmailAccountSettings, 'imapPassword' | 'smtpPassword'>;

    setShowTutorial: (showTutorial: boolean) => void;
    setEmailAccountSettings: (settings: Partial<EmailAccountSettings>) => void;
};

export const useAppSettingsStore = create<AppSettingsState>(
    persist(
        (set, get) => ({
            showTutorial: true,
            emailAccountSettings: {
                imapUser: '',
                imapHost: '',
                imapPort: '993',
                imapUseSsl: 'true',
                imapUseStartTls: 'false',

                smtpUser: '',
                smtpHost: '',
                smtpPort: '587',
                smtpUseSsl: 'false',
                smtpUseStartTls: 'true',
            },

            setShowTutorial: (showTutorial) => set({ showTutorial }),
            setEmailAccountSettings: (settings) => {
                set({ emailAccountSettings: { ...get().emailAccountSettings, ...settings } });

                Promise.all([
                    window.email.getEmailAccountPassword('imap'),
                    window.email.getEmailAccountPassword('smtp'),
                ]).then(([imapPassword, smtpPassword]) =>
                    Email.setCredentials({ ...get().emailAccountSettings, imapPassword, smtpPassword })
                );
            },
        }),
        {
            name: 'Datenanfragen.de-app-settings',
            version: 0,
            // TODO: Use our new PrivacyAsyncStorage here once it is available through the package.
            getStorage: () => localStorage,
            // This is necessary to communicate the credentials to the native plugin.
            onRehydrateStorage: () => (state) => state?.setEmailAccountSettings({}),
        }
    )
);
