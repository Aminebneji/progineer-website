import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const file = formData.get("file") as File;
  const type = formData.get("type") as string;

  const validations = [
    { valid: !!file && file.type?.startsWith("image"), error: "Fichier invalide (image attendue)" },
    { valid: ["article", "realisation"].includes(type), error: "Type de fichier non pris en charge" },
    { valid: !file?.size || file.size <= 5 * 1024 * 1024, error: "Fichier trop lourd (max 5MB)" },
  ];

  for (const { valid, error } of validations) {
    if (!valid) {
      return NextResponse.json({ error }, { status: 400 });
    }
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const safeFileName = `${uuidv4()}-${file.name.replace(/\s+/g, "_")}`;
  const targetFolder = path.join(process.cwd(), "public/uploads", type);
  const targetPath = path.join(targetFolder, safeFileName);

  await mkdir(targetFolder, { recursive: true });
  await writeFile(targetPath, buffer);

  return NextResponse.json({ url: `/uploads/${type}/${safeFileName}` });
}
