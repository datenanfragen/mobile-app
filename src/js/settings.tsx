import { flash, FlashMessage, I18nWidget } from '@datenanfragen/components';
import { IntlProvider, Text } from 'preact-i18n';
import { useAppSettingsStore } from './store/settings';
import { useState } from 'preact/hooks';

export const Settings = () => (
    <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="settings">
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
        <SmtpSettingsInput key="email-settings-component" />
    </IntlProvider>
);

const SmtpSettingsInput = () => {
    const setSmtpSetting = useAppSettingsStore((state) => state.setSmtpSetting);
    const smtpSettings = useAppSettingsStore((state) => state.smtpSettings);
    const [showPassword, setShowPassword] = useState(false);
    const [verifcationLoading, setVerifcationLoading] = useState(false);

    return (
        <fieldset key="email-settings">
            <legend>
                <Text id="email-settings" />
            </legend>
            <Text id="email-settings-explanation" />

            <div className="form-group" key="email-from-container">
                <label htmlFor="from-email">
                    <Text id="from-email" />
                </label>
                <input
                    type="email"
                    className="form-element"
                    id="from-email"
                    value={smtpSettings.account}
                    key="email-from-input"
                    onChange={(e) => setSmtpSetting({ account: e.currentTarget.value })}
                />
            </div>
            <div className="form-group" key="email-password-container">
                <label htmlFor="email-password">
                    <Text id="email-password" />
                </label>
                <div style="display: flex; flex-direction: row; column-gap: 5px;">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-element"
                        id="email-password"
                        key="email-password-input"
                        style="flex-grow: 1"
                        onChange={(e) =>
                            void e.currentTarget.value !== '' && window.email.setSmtpPassword(e.currentTarget.value)
                        }
                    />
                    <button
                        className="button button-secondary button-small icon-access"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
            </div>
            <div className="form-group" key="email-host-container">
                <label htmlFor="email-host">
                    <Text id="email-host" />
                </label>
                <input
                    type="text"
                    className="form-element"
                    id="email-host"
                    value={smtpSettings.host}
                    onChange={(e) => setSmtpSetting({ host: e.currentTarget.value })}
                    key="email-host-input"
                />
            </div>
            <div className="form-group" key="email-port-container">
                <label htmlFor="email-port">
                    <Text id="email-port" />
                </label>
                <input
                    type="number"
                    className="form-element"
                    id="email-port"
                    value={smtpSettings.port}
                    onBlur={(e) => {
                        const parsedPort = parseInt(e.currentTarget.value);
                        setSmtpSetting({
                            port:
                                !isNaN(parsedPort) && parsedPort > 0 && parsedPort < 65535
                                    ? parsedPort
                                    : smtpSettings.secure
                                    ? 465
                                    : 587,
                        });
                    }}
                    min={1}
                    max={65535}
                    key="email-port-input"
                />
            </div>
            <div className="form-group" key="email-secure-container">
                <input
                    type="checkbox"
                    className="form-element"
                    id="email-secure"
                    checked={smtpSettings.secure}
                    onChange={(e) => setSmtpSetting({ secure: e.currentTarget.checked })}
                    key="email-secure-input"
                />
                <label htmlFor="email-secure">
                    <Text id="email-secure" />
                </label>
            </div>
            <button
                className="button button-secondary"
                onClick={() => {
                    setVerifcationLoading(true);
                    window.email
                        .verifyConnection(smtpSettings)
                        .then(() =>
                            flash(
                                <FlashMessage type="success">
                                    <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="settings">
                                        <Text id="smtp-connection-success" />
                                    </IntlProvider>
                                </FlashMessage>
                            )
                        )
                        .catch((e) =>
                            flash(
                                <FlashMessage type="error">
                                    <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="settings">
                                        <Text id="smtp-connection-error" />
                                    </IntlProvider>
                                </FlashMessage>
                            )
                        )
                        .then(() => setVerifcationLoading(false));
                }}
                disabled={verifcationLoading}>
                <Text id={verifcationLoading ? 'test-smtp-connection-loading' : 'test-smtp-connection'} />
            </button>
        </fieldset>
    );
};
