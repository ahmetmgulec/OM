/**
 * Resize and compress an image file, then convert to a data URL for storage in the database.
 * Keeps avatars small (128x128, JPEG 0.8) so they fit within DB limits (~100KB).
 */
const MAX_SIZE = 128;
const JPEG_QUALITY = 0.8;
const MAX_DATA_URL_LENGTH = 100_000;

export function imageToDataUrl(file: File): Promise<string> {
  let objectUrl: string | null = null;
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      if (!ctx) {
        reject(new Error('Canvas not supported'));
        return;
      }

      let { width, height } = img;
      if (width > MAX_SIZE || height > MAX_SIZE) {
        const scale = Math.min(MAX_SIZE / width, MAX_SIZE / height);
        width = Math.round(width * scale);
        height = Math.round(height * scale);
      }
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);
      if (dataUrl.length > MAX_DATA_URL_LENGTH) {
        reject(new Error('Image too large after compression'));
        return;
      }
      resolve(dataUrl);
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    objectUrl = URL.createObjectURL(file);
    img.src = objectUrl;
  }).finally(() => {
    if (objectUrl) URL.revokeObjectURL(objectUrl);
  });
}
