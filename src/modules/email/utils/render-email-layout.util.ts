import Handlebars from 'handlebars';

import { baseHtmlTemplateSource } from '../layouts';
import { LayoutContent } from '../types';

const baseHtmlTemplate = Handlebars.compile<LayoutContent>(baseHtmlTemplateSource);

export const renderEmailLayout = (content: LayoutContent): string => {
  return baseHtmlTemplate(content);
};
