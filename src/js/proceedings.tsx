import { RequestList } from '@datenanfragen/components';
import { SetMobileAppPageFunction } from './index';
import { IntlProvider, Text, MarkupText } from 'preact-i18n';

type ProceedingsProps = {
    setPage: SetMobileAppPageFunction;
};
export const Proceedings = (props: ProceedingsProps) => (
    <IntlProvider definition={window.I18N_DEFINITIONS_MOBILE} scope="proceedings">
        <header>
            <h1>
                <Text id="title" />
            </h1>
        </header>

        <RequestList
            emptyComponent={
                <div className="box box-info" style="width: 80%; margin: auto;">
                    <h2>
                        <Text id="no-requests-heading" />
                    </h2>
                    <Text id="no-requests" />
                    <br />

                    <a
                        className="button button-primary"
                        href=""
                        style="float: right;"
                        onClick={(e) => {
                            e.preventDefault();
                            props.setPage('newRequests');
                        }}>
                        <Text id="generate-request" />
                    </a>
                    <div className="clearfix" />
                </div>
            }
        />
    </IntlProvider>
);
