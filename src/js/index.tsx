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
    AppMenu,
} from '@datenanfragen/components';
import { useAppSettingsStore } from './store/settings';
import { SetupTutorial } from './setup-tutorial';
import { IntlProvider, Text } from 'preact-i18n';
import { Settings } from './settings';
import { useMemo } from 'preact/hooks';
import { Proceedings } from './proceedings';
import { t_a } from '@datenanfragen/components';

const pages = (setPage: SetMobileAppPageFunction, sendMail?: (data: EmailData) => void) => ({
    newRequests: {
        title: t_a('new-requests', 'app'),
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
        title: t_a('proceedings', 'app'),
        component: <Proceedings setPage={setPage} />,
    },
    settings: {
        title: t_a('settings', 'app'),
        component: <Settings />,
    },
});

export type MobileAppPageId = keyof ReturnType<typeof pages>;
export type SetMobileAppPageFunction = (newPage: MobileAppPageId) => void;

const DesktopApp = () => {
    const showTutorial = useAppSettingsStore((state) => state.showTutorial);
    const smtpUser = useAppSettingsStore((state) => state.emailAccountSettings.smtpUser);

    const sendMail = useMemo(
        () =>
            smtpUser === ''
                ? undefined
                : (data: EmailData) => {
                      window.email
                          .sendMessage({
                              ...data,
                              to: [data.to],
                              from: smtpUser, // TODO: Support multiple from adresses
                          })
                          .then(() =>
                              flash(
                                  <FlashMessage type="success">
                                      <IntlProvider definition={window.I18N_DEFINITION_APP} scope="generator">
                                          <Text id="send-email-success" />
                                      </IntlProvider>
                                  </FlashMessage>
                              )
                          )
                          .catch((e) => {
                              console.error('Sending email failed:', e);
                              flash(
                                  <FlashMessage type="error">
                                      <IntlProvider definition={window.I18N_DEFINITION_APP} scope="generator">
                                          <Text id="send-email-error" />
                                      </IntlProvider>
                                  </FlashMessage>
                              );
                          });
                  },
        []
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
                    <AppMenu setPage={setPage} activePage={pageId} />
                    <Wizard />
                </>
            ),
        [showTutorial, pageId]
    );

    return app;
};

const el = document.getElementById('app');
if (el) render(<DesktopApp />, el);
