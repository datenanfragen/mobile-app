package de.datenanfragen.mobile.plugins.Email;

import java.util.ArrayList;
import java.util.Date;
import java.util.Properties;

import com.sun.mail.imap.IMAPFolder;

import jakarta.mail.FetchProfile;
import jakarta.mail.Folder;
import jakarta.mail.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.Store;
import jakarta.mail.Transport;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

public class Email {
    String imapUser = "";
    String imapPassword = "";
    String imapHost = "";
    String imapPort = "";
    String imapUseSsl = "";
    String imapUseStartTls = "";
    String smtpUser = "";
    String smtpPassword = "";
    String smtpHost = "";
    String smtpPort = "";
    String smtpUseSsl = "";
    String smtpUseStartTls = "";

    boolean credentialsChanged = false;

    Session session;
    Store imapStore;
    Transport smtpTransport;

    // TODO: Not sure what a sensible timeout is here. But many of the timeouts default to
    //  "infinite", which seems like a bad idea.
    static String defaultTimeout = "60000";

    public Email() {
    }

    public void setCredentials(String imapUser, String imapPassword, String imapHost,
                               String imapPort, String imapUseSsl, String imapUseStartTls,
                               String smtpUser, String smtpPassword, String smtpHost,
                               String smtpPort, String smtpUseSsl, String smtpUseStartTls) {
        this.credentialsChanged = true;

        this.imapUser = imapUser;
        this.imapPassword = imapPassword;
        this.imapHost = imapHost;
        this.imapPort = imapPort;
        this.imapUseSsl = imapUseSsl;
        this.imapUseStartTls = imapUseStartTls;
        this.smtpUser = smtpUser;
        this.smtpPassword = smtpPassword;
        this.smtpHost = smtpHost;
        this.smtpPort = smtpPort;
        this.smtpUseSsl = smtpUseSsl;
        this.smtpUseStartTls = smtpUseStartTls;
    }

    public void ensureConnection() throws MessagingException {
        if (!credentialsChanged && smtpTransport != null && smtpTransport.isConnected() && imapStore != null && imapStore.isConnected())
            return;

        Properties props = System.getProperties();

        // https://eclipse-ee4j.github.io/mail/docs/api/jakarta.mail/com/sun/mail/imap/package-summary.html#properties
        props.setProperty("mail.imap.host", imapHost);
        props.setProperty("mail.imap.port", imapPort);
        props.setProperty("mail.imap.connectiontimeout", defaultTimeout);
        props.setProperty("mail.imap.timeout", defaultTimeout);
        props.setProperty("mail.imap.writetimeout", defaultTimeout);
        props.setProperty("mail.imap.ssl.enable", imapUseSsl);
        props.setProperty("mail.imap.ssl.checkserveridentity", "true");
        props.setProperty("mail.smtp.starttls.enable", imapUseStartTls);
        props.setProperty("mail.smtp.starttls.required", imapUseStartTls);
        props.setProperty("mail.store.protocol", "imap");

        // https://eclipse-ee4j.github.io/mail/docs/api/jakarta.mail/com/sun/mail/smtp/package-summary.html#properties
        props.setProperty("mail.smtp.host", smtpHost);
        props.setProperty("mail.smtp.port", smtpPort);
        // TODO: Allow setting the from address.
        // props.setProperty("mail.smtp.from", "");
        props.setProperty("mail.smtp.connectiontimeout", defaultTimeout);
        props.setProperty("mail.smtp.timeout", defaultTimeout);
        props.setProperty("mail.smtp.writetimeout", defaultTimeout);
        props.setProperty("mail.smtp.ssl.enable", smtpUseSsl);
        props.setProperty("mail.smtp.starttls.enable", smtpUseStartTls);
        props.setProperty("mail.smtp.starttls.required", smtpUseStartTls);
        props.setProperty("mail.transport.protocol", "smtp");

        session = Session.getInstance(props);

        imapStore = session.getStore();
        imapStore.connect(imapUser, imapPassword);

        smtpTransport = session.getTransport();
        smtpTransport.connect(smtpUser, smtpPassword);

        this.credentialsChanged = false;
    }

    public void sendMessage(String from, String[] to, String subject, String text) throws MessagingException {
        ensureConnection();

        MimeMessage message = new MimeMessage(session);

        ArrayList<InternetAddress> recipients = new ArrayList<>();
        for (String recipient : to) recipients.add(new InternetAddress(recipient));

        message.setFrom(new InternetAddress(from));
        message.setRecipients(MimeMessage.RecipientType.TO, recipients.toArray(new InternetAddress[0]));
        message.setSubject(subject);
        message.setText(text);
        message.setSentDate(new Date());
        message.saveChanges();

        smtpTransport.sendMessage(message, message.getAllRecipients());

        getSentFolder().appendMessages(new Message[]{message});
    }

    public Folder getSentFolder() throws MessagingException {
        ensureConnection();

        Folder[] folders = imapStore.getDefaultFolder().list("*");

        // Try to find a folder with a "sent" attribute, adapted after: https://stackoverflow.com/a/18991378
        for (Folder folder : folders) {
            for (String attribute : ((IMAPFolder) folder).getAttributes()) {
                if (attribute.toLowerCase().contains("sent")) return folder;
            }
        }

        // If there is none, we use (or create) the "Sent" folder at the root level.
        Folder sentFolder = imapStore.getFolder("Sent");
        if (!sentFolder.exists()) sentFolder.create(Folder.HOLDS_MESSAGES);
        return sentFolder;
    }

    public Message[] getMessages() throws MessagingException {
        ensureConnection();

        Folder folder = imapStore.getDefaultFolder().getFolder("INBOX");
        try {
            folder.open(Folder.READ_WRITE);
        } catch (MessagingException ex) {
            folder.open(Folder.READ_ONLY);
        }

        Message[] messages = folder.getMessages();
        FetchProfile fp = new FetchProfile();
        fp.add(FetchProfile.Item.ENVELOPE);
        fp.add(FetchProfile.Item.FLAGS);
        folder.fetch(messages, fp);

        folder.close(false);
        imapStore.close();

        return messages;
    }
}
