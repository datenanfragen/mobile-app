import { flash, FlashMessage, I18nWidget } from '@datenanfragen/components';
import { EmailAccountSettingsInput } from '@datenanfragen/components';
import { IntlProvider, Text } from 'preact-i18n';
import { useAppSettingsStore } from './store/settings';

export const Settings = () => {
    const setEmailAccountSetting = useAppSettingsStore((state) => state.setEmailAccountSetting);
    const emailAccountSettings = useAppSettingsStore((state) => state.emailAccountSettings);

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="settings">
            <header>
                <h1>
                    <Text id="title" />
                </h1>
                {/* TODO: Help icon with explanation text */}
            </header>

            <I18nWidget
                minimal={true}
                showLanguageOnly={false}
                saveLanguagesToStore={true}
                onSavedLanguage={() => window.location.reload()}
            />
            <EmailAccountSettingsInput
                emailAccountSettings={emailAccountSettings}
                allowInsecureConnection={true}
                setEmailAccountSetting={setEmailAccountSetting}
                verifyConnection={() =>
                    window.email.verifyConnection().then((valid) => {
                        if (valid)
                            flash(
                                <FlashMessage type="success">
                                    <IntlProvider definition={window.I18N_DEFINITION_APP} scope="settings">
                                        <Text id="smtp-connection-success" />
                                    </IntlProvider>
                                </FlashMessage>
                            );
                        else
                            flash(
                                <FlashMessage type="error">
                                    <IntlProvider definition={window.I18N_DEFINITION_APP} scope="settings">
                                        <Text id="smtp-connection-error" />
                                    </IntlProvider>
                                </FlashMessage>
                            );
                    })
                }
            />
        </IntlProvider>
    );
};
