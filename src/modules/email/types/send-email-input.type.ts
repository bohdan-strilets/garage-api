export type SendEmailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};
