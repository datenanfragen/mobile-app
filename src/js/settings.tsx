import { flash, FlashMessage, I18nWidget } from '@datenanfragen/components';
import { IntlProvider, Text, translate } from 'preact-i18n';
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
        <EmailAccountSettingsInput key="email-settings-component" />
    </IntlProvider>
);

const EmailAccountSettingsInput = () => {
    const setEmailAccountSetting = useAppSettingsStore((state) => state.setEmailAccountSettings);
    const emailAccountSettings = useAppSettingsStore((state) => state.emailAccountSettings);
    const [showPassword, setShowPassword] = useState(false);
    const [verificationLoading, setVerificationLoading] = useState(false);

    return (
        <fieldset>
            <legend>
                <Text id="email-settings" />
            </legend>
            <Text id="email-settings-explanation" />

            <h2>
                <Text id="imap-heading" />
            </h2>
            <div className="form-group">
                <label htmlFor="imap-user">
                    <Text id="imap-user" />
                </label>
                <input
                    type="email"
                    className="form-element"
                    id="imap-user"
                    value={emailAccountSettings.imapUser}
                    placeholder={translate('imap-user-placeholder', 'settings', window.I18N_DEFINITIONS_MOBILE)}
                    onChange={(e) => setEmailAccountSetting({ imapUser: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="imap-password">
                    <Text id="imap-password" />
                </label>
                <div style="display: flex; flex-direction: row; column-gap: 5px;">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-element"
                        id="imap-password"
                        style="flex-grow: 1"
                        onChange={(e) => window.email.setEmailAccountPassword('imap', e.currentTarget.value)}
                    />
                    <button
                        className="button button-secondary button-small icon-access"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="imap-host">
                    <Text id="imap-host" />
                </label>
                <input
                    type="text"
                    className="form-element"
                    id="imap-host"
                    value={emailAccountSettings.imapHost}
                    onChange={(e) => setEmailAccountSetting({ imapHost: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="imap-port">
                    <Text id="imap-port" />
                </label>
                <input
                    type="number"
                    className="form-element"
                    id="imap-port"
                    value={emailAccountSettings.imapPort}
                    onBlur={(e) => {
                        const parsedPort = parseInt(e.currentTarget.value);
                        setEmailAccountSetting({
                            imapPort:
                                !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? `${parsedPort}` : '587',
                        });
                    }}
                    min={1}
                    max={65535}
                />
            </div>
            <div className="form-group">
                <label htmlFor="imap-connection-security">
                    <Text id="imap-connection-security" />
                </label>
                <div className="select-container">
                    <select
                        value={
                            emailAccountSettings.imapUseSsl === 'true'
                                ? 'ssl'
                                : emailAccountSettings.imapUseStartTls === 'true'
                                ? 'starttls'
                                : 'none'
                        }
                        onChange={(e) =>
                            setEmailAccountSetting({
                                imapUseSsl: `${e.currentTarget.value === 'ssl'}`,
                                imapUseStartTls: `${e.currentTarget.value === 'starttls'}`,
                            })
                        }>
                        {['none', 'starttls', 'ssl'].map((s) => (
                            <option value={s}>
                                <Text id={`email-connection-security-${s}`} />
                            </option>
                        ))}
                    </select>
                    <div className="icon icon-arrow-down" />
                </div>
            </div>

            <hr />

            <h2>
                <Text id="smtp-heading" />
            </h2>
            <div className="form-group">
                <label htmlFor="smtp-user">
                    <Text id="smtp-user" />
                </label>
                <input
                    type="email"
                    className="form-element"
                    id="smtp-user"
                    value={emailAccountSettings.smtpUser}
                    placeholder={translate('smtp-user-placeholder', 'settings', window.I18N_DEFINITIONS_MOBILE)}
                    onChange={(e) => setEmailAccountSetting({ smtpUser: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="smtp-password">
                    <Text id="smtp-password" />
                </label>
                <div style="display: flex; flex-direction: row; column-gap: 5px;">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-element"
                        id="smtp-password"
                        style="flex-grow: 1"
                        onChange={(e) => window.email.setEmailAccountPassword('smtp', e.currentTarget.value)}
                    />
                    <button
                        className="button button-secondary button-small icon-access"
                        onClick={() => setShowPassword(!showPassword)}
                    />
                </div>
            </div>
            <div className="form-group">
                <label htmlFor="smtp-host">
                    <Text id="smtp-host" />
                </label>
                <input
                    type="text"
                    className="form-element"
                    id="smtp-host"
                    value={emailAccountSettings.smtpHost}
                    onChange={(e) => setEmailAccountSetting({ smtpHost: e.currentTarget.value })}
                />
            </div>
            <div className="form-group">
                <label htmlFor="smtp-port">
                    <Text id="smtp-port" />
                </label>
                <input
                    type="number"
                    className="form-element"
                    id="smtp-port"
                    value={emailAccountSettings.smtpPort}
                    onBlur={(e) => {
                        const parsedPort = parseInt(e.currentTarget.value);
                        setEmailAccountSetting({
                            smtpPort:
                                !isNaN(parsedPort) && parsedPort > 0 && parsedPort <= 65535 ? `${parsedPort}` : '587',
                        });
                    }}
                    min={1}
                    max={65535}
                />
            </div>
            <div className="form-group">
                <label htmlFor="smtp-connection-security">
                    <Text id="smtp-connection-security" />
                </label>
                <div className="select-container">
                    <select
                        value={
                            emailAccountSettings.smtpUseSsl === 'true'
                                ? 'ssl'
                                : emailAccountSettings.smtpUseStartTls === 'true'
                                ? 'starttls'
                                : 'none'
                        }
                        onChange={(e) =>
                            setEmailAccountSetting({
                                smtpUseSsl: `${e.currentTarget.value === 'ssl'}`,
                                smtpUseStartTls: `${e.currentTarget.value === 'starttls'}`,
                            })
                        }>
                        {['none', 'starttls', 'ssl'].map((s) => (
                            <option value={s}>
                                <Text id={`email-connection-security-${s}`} />
                            </option>
                        ))}
                    </select>
                    <div className="icon icon-arrow-down" />
                </div>
            </div>

            <button
                className="button button-secondary"
                onClick={() => {
                    setVerificationLoading(true);
                    window.email
                        .verifyConnection()
                        .then((valid) => {
                            if (valid)
                                flash(
                                    <FlashMessage type="success">
                                        <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="settings">
                                            <Text id="smtp-connection-success" />
                                        </IntlProvider>
                                    </FlashMessage>
                                );
                            else
                                flash(
                                    <FlashMessage type="error">
                                        <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="settings">
                                            <Text id="smtp-connection-error" />
                                        </IntlProvider>
                                    </FlashMessage>
                                );
                        })

                        .then(() => setVerificationLoading(false));
                }}
                disabled={verificationLoading}>
                <Text id={verificationLoading ? 'test-smtp-connection-loading' : 'test-smtp-connection'} />
            </button>
        </fieldset>
    );
};
