import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const uploaderId = formData.get("uploaderId") as string;

        if (!file) {
            return NextResponse.json({ error: "No file specified." }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // In a real SaaS, this would use the aws-sdk and create an S3 Pre-signed URL or upload directly to S3.
        // Here we save it locally so the background worker can pick it up.
        const uploadDir = path.join(process.cwd(), "public/uploads");
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, `${Date.now()}_${file.name}`);
        fs.writeFileSync(filePath, buffer);

        // Create job tracker
        const job = await prisma.uploadJob.create({
            data: {
                fileName: file.name,
                status: "PENDING",
                uploadedBy: uploaderId || "anonymous",
            }
        });

        // Fire and forget background job
        await inngest.send({
            name: "app/process.excel",
            data: {
                fileId: job.id,
                filePath,
                uploaderId
            }
        });

        return NextResponse.json({ success: true, jobId: job.id });
    } catch (e: any) {
        console.error("Upload Error:", e);
        return NextResponse.json({ error: e.message || "Upload failed." }, { status: 500 });
    }
}
