import imageCompression from 'browser-image-compression';

const options = {
  maxSizeMB: 1,          // (default: Number.POSITIVE_INFINITY)
  maxWidthOrHeight: 1024, // (default: undefined)
  useWebWorker: true,    // (default: true)
};

export async function compressImage(file: File): Promise<File> {
  try {
    const compressedFile = await imageCompression(file, options);
    console.log(`Compressed file size: ${compressedFile.size / 1024 / 1024} MB`);
    return compressedFile;
  } catch (error) {
    console.error('Image compression error:', error);
    // If compression fails, return the original file
    return file;
  }
}
