import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

const UPLOAD_DIR = join(process.cwd(), "public", "uploads");

/**
 * Save an uploaded file and return its path
 */
export async function saveFile(
  file: File,
  folder: string = "general"
): Promise<string> {
  try {
    // Create upload directory if it doesn't exist
    const uploadPath = join(UPLOAD_DIR, folder);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = file.name.split(".").pop();
    const filename = `${timestamp}-${random}.${extension}`;

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file
    const filepath = join(uploadPath, filename);
    await writeFile(filepath, buffer);

    // Return relative path for database storage
    return `/uploads/${folder}/${filename}`;
  } catch (error) {
    console.error("File upload error:", error);
    throw new Error("Failed to upload file");
  }
}

/**
 * Delete a file from storage
 */
export async function deleteFile(filePath: string): Promise<void> {
  try {
    const fullPath = join(process.cwd(), "public", filePath);
    if (existsSync(fullPath)) {
      const { unlink } = await import("fs/promises");
      await unlink(fullPath);
    }
  } catch (error) {
    console.error("File deletion error:", error);
    // Don't throw - continue even if deletion fails
  }
}

/**
 * Get full URL for a stored file
 */
export function getFileUrl(filePath: string | null | undefined): string {
  if (!filePath) return "/default-avatar.png"; // Add a default image
  return filePath;
}
