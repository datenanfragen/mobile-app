import { render } from 'preact';
import {
    RequestGeneratorProvider,
    createGeneratorStore,
    App,
    useWizard,
    mailto_handlers,
    EmailData,
    flash,
    FlashMessage,
} from '@datenanfragen/components';
import { useAppSettingsStore } from './store/settings';
import { SetupTutorial } from './setup-tutorial';
import { Menu } from './menu';
import { IntlProvider, translate, Text } from 'preact-i18n';
import { Settings } from './settings';
import { useMemo } from 'preact/hooks';
import { Proceedings } from './proceedings';

const pages = (setPage: SetMobileAppPageFunction, sendMail?: (data: EmailData) => void) => ({
    newRequests: {
        title: translate('new-requests', 'app', window.I18N_DEFINITIONS_MOBILE),
        component: (
            <RequestGeneratorProvider createStore={createGeneratorStore}>
                <App
                    pageOptions={{
                        mailtoDropdown: {
                            handlers: sendMail
                                ? ['mailto', 'sendmail' as unknown as keyof typeof mailto_handlers]
                                : ['mailto'],
                            additionalHandlers: {
                                sendmail: {
                                    onClick: (d, _) => sendMail?.(d),
                                    countries: [],
                                },
                            },
                        },
                    }}
                />
            </RequestGeneratorProvider>
        ),
    },
    proceedings: {
        title: translate('proceedings', 'app', window.I18N_DEFINITIONS_MOBILE),
        component: <Proceedings setPage={setPage} />,
    },
    settings: {
        title: translate('settings', 'app', window.I18N_DEFINITIONS_MOBILE),
        component: <Settings />,
    },
});

export type MobileAppPageId = keyof ReturnType<typeof pages>;
export type SetMobileAppPageFunction = (newPage: MobileAppPageId) => void;

const DesktopApp = () => {
    const showTutorial = useAppSettingsStore((state) => state.showTutorial);
    const smtpSettings = useAppSettingsStore((state) => state.smtpSettings);

    const sendMail = useMemo(
        () =>
            smtpSettings.account === ''
                ? undefined
                : (data: EmailData) => {
                      window.email
                          .sendMessage({
                              ...data,
                              from: smtpSettings.account, // TODO: Support multiple from adresses
                              smtpOptions: smtpSettings,
                          })
                          .then((info) => {
                              console.log(info);
                              if (!info.accepted.includes(data.to)) throw Error('From address was not accepted');
                          })
                          .then(() =>
                              flash(
                                  <FlashMessage type="success">
                                      <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="generator">
                                          <Text id="send-email-success" />
                                      </IntlProvider>
                                  </FlashMessage>
                              )
                          )
                          .catch((e) =>
                              flash(
                                  <FlashMessage type="error">
                                      <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="generator">
                                          <Text id="send-email-error" />
                                      </IntlProvider>
                                  </FlashMessage>
                              )
                          );
                  },
        [smtpSettings]
    );

    const { Wizard, set, pageId } = useWizard(pages(setPage, sendMail), {
        initialPageId: 'newRequests',
    });

    function setPage(new_page: MobileAppPageId) {
        set(new_page);
    }

    const app = useMemo(
        () =>
            showTutorial ? (
                <SetupTutorial />
            ) : (
                <>
                    <Menu setPage={setPage} activePage={pageId} />
                    <Wizard />
                </>
            ),
        [showTutorial, pageId]
    );

    return app;
};

const el = document.getElementById('app');
if (el) render(<DesktopApp />, el);
