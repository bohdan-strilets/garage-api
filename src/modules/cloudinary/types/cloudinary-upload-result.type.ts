import { UploadApiResponse } from 'cloudinary';

export type CloudinaryUploadResult = Pick<
  UploadApiResponse,
  'public_id' | 'secure_url' | 'url' | 'format' | 'bytes' | 'width' | 'height'
>;
