// src/utils/compressImage.ts
import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 0.10,
  maxWidthOrHeight: 600,
  useWebWorker: true,
};

export async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed size: ${(compressedFile.size / 1024).toFixed(2)} KB`);
    return compressedFile;
  } catch (err) {
    console.error("Compression error:", err);
    return file; // fallback if compression fails
  }
}
