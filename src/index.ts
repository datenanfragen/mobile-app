import { LocalNotifications } from '@capacitor/local-notifications';
import { Imap, Comparison } from '@awesome-cordova-plugins/imap';

(async () => {
    LocalNotifications.schedule({
        notifications: [{ title: 'Test notification', body: 'Hello, world!', id: 1 }],
    });

    console.log('abc');
    await Imap.connect({
        host: 'imap.ethereal.email',
        user: 'yoshiko.keebler57@ethereal.email',
        password: 'RaKq4aBvGS3jjFbccS',
        port: 993,
    });
    await Imap.isConnected()
        .then((res) => console.log('aaaaa', res))
        .catch((err) => console.error('bbbbbb', err));
    const folders = await Imap.listMailFolders('');
    console.log('folders', folders);

    const msgs = await Imap.listMessagesHeadersByConsecutiveNumber('INBOX', 1, 1);
    console.log('messages', JSON.stringify(msgs, null, 4));

    await Imap.disconnect();
    console.log('eeeeee');
})();
