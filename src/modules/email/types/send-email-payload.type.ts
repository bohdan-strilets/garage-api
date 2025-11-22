export type SendEmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};
