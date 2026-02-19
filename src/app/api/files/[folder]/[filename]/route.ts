
import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join, extname } from "path";
import { existsSync } from "fs";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ folder: string; filename: string }> }
) {
    try {
        const { folder, filename } = await params;

        // Sanitize path to prevent traversal
        const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "");
        const safeFilename = filename.replace(/[^a-zA-Z0-9_.-]/g, "");

        if (!safeFolder || !safeFilename) {
            return NextResponse.json({ error: "Invalid path" }, { status: 400 });
        }

        const filePath = join(process.cwd(), "public", "uploads", safeFolder, safeFilename);

        if (!existsSync(filePath)) {
            return NextResponse.json({ error: "File not found" }, { status: 404 });
        }

        const fileBuffer = await readFile(filePath);

        const ext = extname(safeFilename).toLowerCase();
        let mimeType = "application/octet-stream";
        if (ext === ".pdf") mimeType = "application/pdf";
        else if (ext === ".png") mimeType = "image/png";
        else if (ext === ".jpg" || ext === ".jpeg") mimeType = "image/jpeg";
        else if (ext === ".txt") mimeType = "text/plain";

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": mimeType,
                "Content-Disposition": `inline; filename="${safeFilename}"`
            }
        });
    } catch (error) {
        console.error("File serve error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
