import type { appTranslations, Proceeding } from '@datenanfragen/components';
import type { SendMessageOptions } from '../../plugins/email';

declare global {
    interface Window {
        /** The current language version's base URL, including the trailing slash. */
        readonly BASE_URL: string;
        /** The site version as specified in `package.json`. */
        readonly CODE_VERSION: string;

        readonly I18N_DEFINITION_APP: typeof appTranslations['en'];

        email: {
            setEmailAccountPassword: (protocol: 'imap' | 'smtp', password: string) => Promise<void>;
            getEmailAccountPassword: (protocol: 'imap' | 'smtp') => Promise<string>;

            verifyConnection: () => Promise<boolean>;
            sendMessage: (options: SendMessageOptions) => Promise<void>;
        };

        ON_PROCEEDING_STATUS_CHANGE?: (proceeding: Proceeding, oldStatus: ProceedingStatus) => void;
    }

    // We don't need the full node types.
    const process: {
        readonly env: {
            readonly NODE_ENV: 'production' | 'development';
        };
    };
}
