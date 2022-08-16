import type i18n_definition_type from '../../i18n/en.json';
import type { SendMessageOptions } from '../../plugins/email';

declare global {
    interface Window {
        /** The current language version's base URL, including the trailing slash. */
        readonly BASE_URL: string;
        /** The site version as specified in `package.json`. */
        readonly CODE_VERSION: string;

        readonly I18N_DEFINITIONS_MOBILE: typeof i18n_definition_type;

        email: {
            setEmailAccountPassword: (protocol: 'imap' | 'smtp', password: string) => Promise<void>;
            getEmailAccountPassword: (protocol: 'imap' | 'smtp') => Promise<string>;

            verifyConnection: () => Promise<boolean>;
            sendMessage: (options: SendMessageOptions) => Promise<void>;
        };
    }

    // We don't need the full node types.
    const process: {
        readonly env: {
            readonly NODE_ENV: 'production' | 'development';
        };
    };
}
