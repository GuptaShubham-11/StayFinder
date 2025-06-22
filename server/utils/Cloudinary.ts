import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

// -------------- Type Definitions --------------
type ResourceType = 'image' | 'auto';

interface UploadResult {
  url: string;
  secure_url: string;
  public_id: string;
  resource_type?: string;
  [key: string]: any;
}

// -------------- Cloudinary Config --------------
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// -------------- Single Upload --------------
export const uploadOnCloudinary = async (
  localFilePath: string,
  resource_type: ResourceType = 'image'
): Promise<UploadResult | null> => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type,
    });

    fs.unlinkSync(localFilePath);
    return response;
  } catch (error) {
    if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
    console.error('Cloudinary upload error:', error);
    return null;
  }
};

// -------------- Extract Public ID --------------
export const extractPublicId = (url: string): string => {
  const fileName = path.basename(url); // e.g., abc123.jpg
  return fileName.split('.')[0]; // "abc123"
};

// -------------- Delete File From Cloudinary --------------
export const deleteOnCloudinary = async (
  fileUrl: string,
  resource_type: ResourceType = 'image'
): Promise<any | null> => {
  try {
    if (!fileUrl) return null;

    const publicId = extractPublicId(fileUrl);
    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type,
    });

    return response;
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return null;
  }
};
