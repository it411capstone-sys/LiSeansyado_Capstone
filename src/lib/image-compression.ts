import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 0.5,          // Greatly reduce file size for faster uploads
  maxWidthOrHeight: 800, // Resize image to be smaller
  useWebWorker: true,    // (default: true)
};

export async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${compressedFile.size / 1024} KB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, return the original file
    return file;
  }
}
