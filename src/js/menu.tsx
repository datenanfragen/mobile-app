import { MobileAppPageId, SetMobileAppPageFunction } from './index';
import { IntlProvider } from 'preact-i18n';
import { t_a } from '@datenanfragen/components';

type MenuProps = {
    setPage: SetMobileAppPageFunction;
    activePage: MobileAppPageId;
};

const menuItems: Array<{ title: string; pageId: MobileAppPageId; icon: string }> = [
    {
        title: t_a('new-requests', 'app'),
        pageId: 'newRequests',
        icon: 'plus-circle',
    },
    {
        title: t_a('proceedings', 'app'),
        pageId: 'proceedings',
        icon: 'conversation',
    },
    { title: t_a('settings', 'app'), pageId: 'settings', icon: 'settings' },
];

export const Menu = (props: MenuProps) => (
    <IntlProvider definition={window.I18N_DEFINITION_APP} scope="app">
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
