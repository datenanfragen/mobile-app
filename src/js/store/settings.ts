import create from 'zustand';
import { persist } from 'zustand/middleware';

type AppSettingsState = {
    showTutorial: boolean;
    smtpSettings: SmtpSettings;

    setShowTutorial: (showTutorial: boolean) => void;
    setSmtpSetting: (smtpSetting: Partial<SmtpSettings>) => void;
};

export type SmtpSettings = {
    account: string;
    port: number;
    host: string;
    secure: boolean;
};
export const useAppSettingsStore = create<AppSettingsState>(
    persist(
        (set, get) => ({
            showTutorial: true,
            smtpSettings: { port: 465, secure: true, host: 'example.com', account: '' },

            setShowTutorial: (showTutorial) => set({ showTutorial }),
            setSmtpSetting: (smtpSetting) => set({ smtpSettings: { ...get().smtpSettings, ...smtpSetting } }),
        }),
        {
            name: 'Datenanfragen.de-app-settings',
            version: 0,
            // TODO: Use our new PrivacyAsynStorage here once it is available through the package.
            getStorage: () => localStorage,
        }
    )
);
