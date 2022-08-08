import { MobileAppPageId, SetMobileAppPageFunction } from './index';
import { IntlProvider, translate } from 'preact-i18n';

type MenuProps = {
    setPage: SetMobileAppPageFunction;
    activePage: MobileAppPageId;
};

const menuItems: Array<{ title: string; pageId: MobileAppPageId; icon: string }> = [
    {
        title: translate('new-requests', 'app', window.I18N_DEFINITIONS_MOBILE),
        pageId: 'newRequests',
        icon: 'plus-circle',
    },
    {
        title: translate('proceedings', 'app', window.I18N_DEFINITIONS_MOBILE),
        pageId: 'proceedings',
        icon: 'conversation',
    },
    { title: translate('settings', 'app', window.I18N_DEFINITIONS_MOBILE), pageId: 'settings', icon: 'settings' },
];

export const Menu = (props: MenuProps) => (
    <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="app">
        <nav id="main-menu">
            <ul>
                {menuItems.map((item) => (
                    <li className={item.pageId === props.activePage ? ' menu-item-active' : ''}>
                        <a
                            href=""
                            className={`menu-link icon icon-${item.icon}`}
                            onClick={(e) => {
                                e.preventDefault();
                                props.setPage(item.pageId);
                            }}
                            title={item.title}
                        />
                    </li>
                ))}
            </ul>
        </nav>
    </IntlProvider>
);
