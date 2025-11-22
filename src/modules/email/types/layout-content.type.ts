export type ButtonContent = {
  label: string;
  url: string;
};

export type LayoutContent = {
  title: string;
  greeting: string;
  mainTextLines: string[];
  button?: ButtonContent;
  footerText?: string;
};
