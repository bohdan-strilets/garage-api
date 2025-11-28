import { Image } from '../schemas';

export type ImageCollection = {
  resources: Image[];
  selected: Image | null;
};
