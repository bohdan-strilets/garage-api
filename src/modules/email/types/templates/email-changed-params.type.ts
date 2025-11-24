export type EmailChangedParams = {
  userName: string;
  newEmail: string;
  oldEmail: string;
};

export type SendEmailChangedParams = {
  to: string;
  userName: string;
  newEmail: string;
  oldEmail: string;
};
