/**
 * Upload image to 0x0.st (no API key required).
 * Returns the public URL or throws on error.
 */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://0x0.st', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Upload failed (${response.status})`);
  }

  // Response is plain text URL; strip whitespace/control chars
  let url = (await response.text()).replace(/[\s\r\n\u00a0]/g, '').trim();
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    throw new Error('Invalid response from upload service');
  }
  try {
    new URL(url);
  } catch {
    throw new Error('Invalid URL returned from upload service');
  }

  return url;
}
