import { NextRequest, NextResponse } from "next/server";
import { saveFile, deleteFile } from "@/lib/fileUpload";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: "File and userId are required" },
        { status: 400 }
      );
    }

    // Validate file size (e.g., max 5MB)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size must be less than 5MB" },
        { status: 400 }
      );
    }

    // Validate file type
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Only image files are allowed" },
        { status: 400 }
      );
    }

    // Get current user to delete old image
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { imageUrl: true },
    });

    // Save new file
    const imageUrl = await saveFile(file, "user-avatars");

    // Delete old image if exists
    if (currentUser?.imageUrl) {
      await deleteFile(currentUser.imageUrl);
    }

    // Update database
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { imageUrl },
      select: { id: true, email: true, name: true, imageUrl: true },
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
