// src/utils/compressImage.ts
import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 0.5,
  maxWidthOrHeight: 800,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<File> {
  try {
    console.log(`Original size: ${(file.size / 1024 / 1024).toFixed(2)} MB`);
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    return compressedFile;
  } catch (err) {
    console.error("Image compression error:", err);
    // Return original file if compression fails
    return file; 
  }
}
