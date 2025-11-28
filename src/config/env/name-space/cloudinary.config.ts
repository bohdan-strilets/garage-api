import { ConfigType, registerAs } from '@nestjs/config';

export const cloudinaryConfig = registerAs('cloudinary', () => {
  const cloudName = process.env.CLOUDINARY_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  const rootFolder = process.env.CLOUDINARY_ROOT_FOLDER ?? 'garage';

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary env variables are not set correctly');
  }

  return {
    cloudName,
    apiKey,
    apiSecret,
    rootFolder,
  };
});

export type CloudinaryConfig = ConfigType<typeof cloudinaryConfig>;
