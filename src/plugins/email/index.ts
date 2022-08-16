import { registerPlugin } from '@capacitor/core';

import type { EmailPlugin } from './definitions';

const Email = registerPlugin<EmailPlugin>('Email');

export * from './definitions';
export { Email };
