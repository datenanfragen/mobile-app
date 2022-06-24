import { render } from 'preact';
import { ActWidget } from '@datenanfragen/components';

const App = () => (
    <>
        <ActWidget requestTypes={['access', 'erasure']} company="datenanfragen" transportMedium="email" />
    </>
);

const el = document.getElementById('app');
if (el) render(<App />, el);
