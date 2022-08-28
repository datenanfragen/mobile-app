import { flash, FlashMessage, I18nWidget, useCacheStore, useAppStore } from '@datenanfragen/components';
import { EmailAccountSettingsInput } from '@datenanfragen/components';
import { IntlProvider, Text } from 'preact-i18n';
import { useAppSettingsStore } from './store/settings';

export const Settings = () => {
    const [setEmailAccountSetting, setReceiveNotifications, setUseOfflineSearch] = useAppSettingsStore((state) => [
        state.setEmailAccountSetting,
        state.setReceiveNotifications,
        state.setUseOfflineSearch,
    ]);
    const [emailAccountSettings, receiveNotifications, useOfflineSearch] = useAppSettingsStore((state) => [
        state.emailAccountSettings,
        state.receiveNotifications,
        state.useOfflineSearch,
    ]);

    const savedLocale = useAppStore((state) => state.savedLocale);

    const [offlineDataDate, updateOfflineData] = useCacheStore((state) => [state.date, state.updateOfflineData]);

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="settings">
            <header>
                <h1>
                    <Text id="title" />
                </h1>
                {/* TODO: Help icon with explanation text */}
            </header>

            <fieldset style="margin-bottom: 20px;">
                <legend>
                    <Text id="i18n" />
                </legend>
                <I18nWidget
                    minimal={true}
                    showLanguageOnly={false}
                    saveLanguagesToStore={true}
                    onSavedLanguage={() => window.location.reload()}
                />
            </fieldset>

            <fieldset style="margin-bottom: 20px;">
                <legend>
                    <Text id="features" />
                </legend>
                <label>
                    <input
                        checked={receiveNotifications}
                        type="checkbox"
                        className="form-element"
                        onChange={(e) => setReceiveNotifications(e.currentTarget.checked)}
                    />
                    <Text id="receive-notifications" />
                </label>
                <br />
                <label>
                    <input
                        checked={useOfflineSearch}
                        type="checkbox"
                        className="form-element"
                        onChange={(e) => setUseOfflineSearch(e.currentTarget.checked)}
                    />
                    <Text id="use-offline-search" />
                </label>
                {useOfflineSearch && (
                    <>
                        <br />
                        <Text
                            id="offline-search-updated-at"
                            fields={{
                                date: new Date(offlineDataDate).toLocaleString(savedLocale, {
                                    dateStyle: 'long',
                                    timeStyle: 'medium',
                                }),
                            }}
                        />{' '}
                        <button className="button button-secondary button-small" onClick={updateOfflineData}>
                            <Text id="offline-search-update" />
                        </button>
                    </>
                )}
            </fieldset>

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
