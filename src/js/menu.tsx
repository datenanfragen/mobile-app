import { MobileAppPageId, SetMobileAppPageFunction } from './index';
import { IntlProvider } from 'preact-i18n';
import { t_a, useProceedingsStore, Proceeding } from '@datenanfragen/components';
import { useMemo } from 'preact/hooks';
import type { ComponentChildren } from 'preact';

type MenuProps = {
    setPage: SetMobileAppPageFunction;
    activePage: MobileAppPageId;
};

export const Menu = (props: MenuProps) => {
    // The type of useProceedingsStore is not exported correctly. :(
    const proceedings: Record<string, Proceeding> = useProceedingsStore((state: any) => state.proceedings);
    const overdueProceedings = useMemo(
        () => Object.values(proceedings).filter((p) => p.status === 'overdue'),
        [proceedings]
    );

    const menuItems: Array<{ title: string; pageId: MobileAppPageId; icon: string; badge?: ComponentChildren }> =
        useMemo(
            () => [
                {
                    title: t_a('new-requests', 'app'),
                    pageId: 'newRequests',
                    icon: 'plus-circle',
                },
                {
                    title: t_a('proceedings', 'app'),
                    pageId: 'proceedings',
                    icon: 'conversation',
                    badge:
                        overdueProceedings.length > 0 ? (
                            <>
                                {overdueProceedings.length}{' '}
                                <span class="sr-only">{t_a('overdue-requests', 'app')}</span>
                            </>
                        ) : undefined,
                },
                { title: t_a('settings', 'app'), pageId: 'settings', icon: 'settings' },
            ],
            [overdueProceedings]
        );

    return (
        <IntlProvider definition={window.I18N_DEFINITION_APP} scope="app">
            <nav id="main-menu">
                <ul>
                    {menuItems.map((item) => (
                        <li className={item.pageId === props.activePage ? ' menu-item-active' : ''}>
                            <a
                                href=""
                                className={`menu-link icon icon-${item.icon} has-badge`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    props.setPage(item.pageId);
                                }}
                                title={item.title}>
                                {item.badge && <span className="badge">{item.badge}</span>}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </IntlProvider>
    );
};
