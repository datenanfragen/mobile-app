type StringifiedBoolean = 'true' | 'false';
type StringifiedNumber = `${number}`;

export type EmailAccountSettings = {
    imapUser: string;
    imapPassword: string;
    imapHost: string;
    imapPort: StringifiedNumber;
    imapUseSsl: StringifiedBoolean;
    imapUseStartTls: StringifiedBoolean;

    smtpUser: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: StringifiedNumber;
    smtpUseSsl: StringifiedBoolean;
    smtpUseStartTls: StringifiedBoolean;
};
export type SendMessageOptions = {
    from: string;
    to: string[];
    subject: string;
    text: string;
};

export interface EmailPlugin {
    setCredentials(options: EmailAccountSettings): Promise<void>;
    verifyConnection: () => Promise<{ valid: boolean }>;

    sendMessage(options: SendMessageOptions): Promise<void>;
    getMessages(): Promise<unknown>;
}
