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
    ProceedingsList,
    miniSearchClient,
    useCacheStore,
} from '@datenanfragen/components';
import { useAppSettingsStore } from './store/settings';
import { SetupTutorial } from './setup-tutorial';
import { IntlProvider, Text } from 'preact-i18n';
import { Settings } from './settings';
import { useMemo } from 'preact/hooks';
import { t_a } from '@datenanfragen/components';

const pages = (
    setPage: SetMobileAppPageFunction,
    offlineSearch: false | Parameters<typeof miniSearchClient>[0],
    sendMail?: (data: EmailData) => void
) => ({
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
                        searchClient: offlineSearch ? (params) => miniSearchClient(offlineSearch, params) : undefined,
                    }}
                />
            </RequestGeneratorProvider>
        ),
    },
    proceedings: {
        title: t_a('proceedings', 'app'),
        component: <ProceedingsList setPage={setPage} />,
    },
    settings: {
        title: t_a('settings', 'app'),
        component: <Settings />,
    },
});

export type MobileAppPageId = keyof ReturnType<typeof pages>;
export type SetMobileAppPageFunction = (newPage: MobileAppPageId) => void;

const DesktopApp = () => {
    const [showTutorial, useOfflineSearch] = useAppSettingsStore((state) => [
        state.showTutorial,
        state.useOfflineSearch,
    ]);
    const smtpUser = useAppSettingsStore((state) => state.emailAccountSettings.smtpUser);

    const [miniSearch, offlineDataDate] = useCacheStore((state) => [state.miniSearch, state.date]);
    const updateOfflineData = useCacheStore((state) => state.updateOfflineData);

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

    const { Wizard, set, pageId } = useWizard(pages(setPage, useOfflineSearch ? miniSearch : false, sendMail), {
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
                    {useOfflineSearch && new Date(offlineDataDate) < new Date(Date.now() - 1000 * 60 * 60 * 24 * 14) && (
                        <div class="box box-warning" style="margin-bottom: 20px;">
                            {t_a('offline-data-outdated', 'settings')}
                            <button class="button button-secondary button-small" onClick={updateOfflineData}>
                                {t_a('offline-search-update', 'settings')}
                            </button>
                        </div>
                    )}
                    <Wizard />
                </>
            ),
        [showTutorial, pageId]
    );

    return app;
};

const el = document.getElementById('app');
if (el) render(<DesktopApp />, el);
