import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json");

type Project = {
  title: string;
  description: string;
  tags: string[];
};

type PortfolioData = {
  name: string;
  title: string;
  about: string[];
  projects: Project[];
};

function validatePortfolioData(data: any): data is PortfolioData {
  if (!data || typeof data !== "object") return false;
  
  // 基本フィールドの検証
  if (typeof data.name !== "string" || data.name.length > 100) return false;
  if (typeof data.title !== "string" || data.title.length > 200) return false;
  
  // aboutの検証
  if (!Array.isArray(data.about) || data.about.length > 20) return false;
  if (!data.about.every((p: any) => typeof p === "string" && p.length <= 2000)) return false;
  
  // projectsの検証
  if (!Array.isArray(data.projects) || data.projects.length > 50) return false;
  for (const project of data.projects) {
    if (typeof project.title !== "string" || project.title.length > 200) return false;
    if (typeof project.description !== "string" || project.description.length > 2000) return false;
    if (!Array.isArray(project.tags) || project.tags.length > 20) return false;
    if (!project.tags.every((t: any) => typeof t === "string" && t.length <= 50)) return false;
  }
  
  return true;
}

export async function GET() {
  try {
    const fileContents = await fs.readFile(dataFilePath, "utf8");
    const data = JSON.parse(fileContents);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to read data" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // 認証チェック
    const password = request.headers.get("x-admin-password");
    const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
    
    if (!password || password !== adminPassword) {
      return NextResponse.json(
        { error: "Unauthorized", type: "auth" },
        { status: 401 }
      );
    }

    // ペイロードサイズチェック（約1MB）
    const contentLength = request.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > 1048576) {
      return NextResponse.json(
        { error: "Payload too large", type: "validation" },
        { status: 400 }
      );
    }

    const data = await request.json();
    
    // データバリデーション
    if (!validatePortfolioData(data)) {
      return NextResponse.json(
        { error: "Invalid data format or exceeded size limits", type: "validation" },
        { status: 400 }
      );
    }

    // データ保存
    await fs.writeFile(dataFilePath, JSON.stringify(data, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON", type: "validation" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Internal server error", type: "server" },
      { status: 500 }
    );
  }
}
