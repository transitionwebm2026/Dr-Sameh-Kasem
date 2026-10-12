const MAX_DIMENSION = 1920;
const QUALITY = 0.82;

// Vector (already tiny, resizing makes no sense) and animated (canvas would
// flatten it to a single frame) formats pass through untouched.
const SKIP_TYPES = new Set(["image/svg+xml", "image/gif"]);

/**
 * Downscales to at most 1920px on the long edge and re-encodes as WebP
 * before upload, so a straight-from-camera/phone photo (often several MB
 * and far larger than any layout ever displays it) doesn't ship to every
 * visitor at full size — there's no server-side image optimization under
 * static export to catch this after the fact.
 */
export async function compressImage(file: File): Promise<File> {
  if (SKIP_TYPES.has(file.type)) return file;

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }

  const scale = Math.min(1, MAX_DIMENSION / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    return file;
  }
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", QUALITY)
  );
  if (!blob || blob.size >= file.size) return file;

  const newName = file.name.replace(/\.[^.]+$/, "") + ".webp";
  return new File([blob], newName, { type: "image/webp" });
}
