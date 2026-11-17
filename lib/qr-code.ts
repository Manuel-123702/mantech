import QRCode from 'qrcode';

/**
 * Generates an SVG or Data URL string for a given text or URL.
 */
export async function generateQrDataUrl(text: string, options?: QRCode.QRCodeToDataURLOptions): Promise<string> {
  try {
    return await QRCode.toDataURL(text, {
      width: options?.width || 200,
      margin: options?.margin ?? 1,
      color: {
        dark: options?.color?.dark || '#0369a1', // Deep ocean cyan/blue
        light: options?.color?.light || '#ffffff',
      },
    });
  } catch (error) {
    console.error('[qr-code] Failed to generate QR data URL:', error);
    // Return empty transparent 1x1 png fallback
    return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  }
}
