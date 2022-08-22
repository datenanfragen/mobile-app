import create from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import { Email, EmailAccountSettings } from '../../plugins/email';

type AppSettingsState = {
    showTutorial: boolean;
    emailAccountSettings: Omit<EmailAccountSettings, 'imapPassword' | 'smtpPassword'>;

    setShowTutorial: (showTutorial: boolean) => void;
    setEmailAccountSetting: <KeyT extends keyof EmailAccountSettings>(
        setting: KeyT,
        value: EmailAccountSettings[KeyT]
    ) => Promise<void>;

    syncEmailAccountSettingsWithNativeCode: () => Promise<void>;
};

export const useAppSettingsStore = create<AppSettingsState>(
    persist(
        (set, get) => ({
            showTutorial: true,
            emailAccountSettings: {
                imapUser: '',
                imapHost: '',
                imapPort: 993,
                imapUseSsl: true,
                imapUseStartTls: false,

                smtpUser: '',
                smtpHost: '',
                smtpPort: 587,
                smtpUseSsl: false,
                smtpUseStartTls: true,
            },

            setShowTutorial: (showTutorial) => set({ showTutorial }),
            setEmailAccountSetting: async (setting, value) => {
                if (setting === 'imapPassword') await window.email.setEmailAccountPassword('imap', value as string);
                else if (setting === 'smtpPassword')
                    await window.email.setEmailAccountPassword('smtp', value as string);
                else
                    set(
                        produce((state) => {
                            state.emailAccountSettings[setting] = value;
                        })
                    );

                return get().syncEmailAccountSettingsWithNativeCode();
            },

            syncEmailAccountSettingsWithNativeCode: () =>
                Promise.all([
                    window.email.getEmailAccountPassword('imap'),
                    window.email.getEmailAccountPassword('smtp'),
                ]).then(([imapPassword, smtpPassword]) =>
                    Email.setCredentials({ ...get().emailAccountSettings, imapPassword, smtpPassword })
                ),
        }),
        {
            name: 'Datenanfragen.de-app-settings',
            version: 0,
            // TODO: Use our new PrivacyAsyncStorage here once it is available through the package.
            getStorage: () => localStorage,
            // This is necessary to communicate the credentials to the native plugin.
            onRehydrateStorage: () => async (state) => {
                if (!state) return;
                // In my testing, the window wasn't set up yet when this is called.
                while (!window.email) await new Promise((res) => setTimeout(res, 100));

                state.syncEmailAccountSettingsWithNativeCode();
            },
        }
    )
);
