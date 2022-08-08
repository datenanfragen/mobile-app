import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'de.datenanfragen.mobile',
    appName: 'Datenanfragen.de',
    webDir: 'public',
    bundledWebRuntime: false,

    plugins: {
        LocalNotifications: {
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#214192',
            sound: 'beep.wav',
        },
    },

    android: {
        overrideUserAgent: process.env.NODE_ENV === 'development' ? 'dade-app-dev' : undefined,
    },

    server: {
        url: process.env.NODE_ENV === 'development' ? 'http://localhost:1234' : undefined,
        cleartext: process.env.NODE_ENV === 'development',
        allowNavigation: [],
    },
};

export default config;
