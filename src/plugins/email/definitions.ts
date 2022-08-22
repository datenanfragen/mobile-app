export type EmailAccountSettings = {
    imapUser: string;
    imapPassword: string;
    imapHost: string;
    imapPort: number;
    imapUseSsl: boolean;
    imapUseStartTls: boolean;

    smtpUser: string;
    smtpPassword: string;
    smtpHost: string;
    smtpPort: number;
    smtpUseSsl: boolean;
    smtpUseStartTls: boolean;
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
