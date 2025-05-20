import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

export default cloudinary;

export const getCloudinaryUrl = (publicId: string, options: {
    width?: number;
    height?: number;
    quality?: number;
    format?: string;
} = {}) => {
    const { width, height, quality = 'auto', format = 'auto' } = options;
    
    const transformations = [
        'f_' + format,
        'q_' + quality,
        width && 'w_' + width,
        height && 'h_' + height,
    ].filter(Boolean).join(',');

    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
}; 