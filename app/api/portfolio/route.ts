import { NextResponse } from "next/server";
import { getPortfolioData } from "@/lib/portfolio";
import type { PortfolioData } from "@/lib/portfolio";
import { getSupabaseServerClient } from "@/lib/supabase";
import type { Database } from "@/lib/supabase";

const PORTFOLIO_ID = 1;
const isDev = process.env.NODE_ENV !== "production";

type PortfolioInsert = Database["public"]["Tables"]["portfolio"]["Insert"];
type AboutInsert = Database["public"]["Tables"]["portfolio_abouts"]["Insert"];
type ProjectInsert = Database["public"]["Tables"]["projects"]["Insert"];
type ProjectTagInsert = Database["public"]["Tables"]["project_tags"]["Insert"];

type SupabaseErrorLike = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
} | null;

function formatSupabaseError(error: SupabaseErrorLike) {
  if (!error) return null;
  return {
    message: error.message ?? "Unknown error",
    code: error.code ?? null,
    details: error.details ?? null,
    hint: error.hint ?? null,
  };
}

function respondSupabaseError(action: string, error: SupabaseErrorLike) {
  console.error(`Supabase error during ${action}`, error);
  return NextResponse.json(
    {
      error: `Failed to ${action}`,
      type: "server",
      ...(isDev ? { detail: formatSupabaseError(error) } : {}),
    },
    { status: 500 }
  );
}

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
    const data = await getPortfolioData();

    if (!data) {
      return NextResponse.json({
        name: "",
        title: "",
        about: [""],
        projects: [],
      } satisfies PortfolioData);
    }

    return NextResponse.json({
      ...data,
      about: data.about.length > 0 ? data.about : [""],
    });
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

    const supabase = getSupabaseServerClient();

    const portfolioRow: PortfolioInsert = {
      id: PORTFOLIO_ID,
      name: data.name,
      title: data.title,
    };

    const { error: upsertError } = await supabase
      .from("portfolio")
      .upsert(portfolioRow);

    if (upsertError) {
      return respondSupabaseError("save portfolio", upsertError);
    }

    const { error: deleteAboutError } = await supabase
      .from("portfolio_abouts")
      .delete()
      .eq("portfolio_id", PORTFOLIO_ID);

    if (deleteAboutError) {
      return respondSupabaseError("update about", deleteAboutError);
    }

    const aboutRows: AboutInsert[] = data.about.map(
      (content: string, index: number) => ({
        portfolio_id: PORTFOLIO_ID,
        content,
        sort_order: index,
      })
    );

    if (aboutRows.length > 0) {
      const { error: insertAboutError } = await supabase
        .from("portfolio_abouts")
        .insert(aboutRows);

      if (insertAboutError) {
        return respondSupabaseError("update about", insertAboutError);
      }
    }

    const { error: deleteProjectsError } = await supabase
      .from("projects")
      .delete()
      .eq("portfolio_id", PORTFOLIO_ID);

    if (deleteProjectsError) {
      return respondSupabaseError("update projects", deleteProjectsError);
    }

    if (data.projects.length > 0) {
      const projectRows: ProjectInsert[] = data.projects.map(
        (project, index) => ({
          portfolio_id: PORTFOLIO_ID,
          title: project.title,
          description: project.description,
          sort_order: index,
        })
      );

      const { data: insertedProjects, error: insertProjectsError } = await supabase
        .from("projects")
        .insert(projectRows)
        .select("id, sort_order");

      if (insertProjectsError || !insertedProjects) {
        return respondSupabaseError("update projects", insertProjectsError);
      }

      const tagRows: ProjectTagInsert[] = insertedProjects.flatMap(
        (project: { id: number; sort_order: number | null }) => {
          const projectIndex = project.sort_order ?? 0;
          const tags = data.projects[projectIndex]?.tags ?? [];
          return tags.map((tag, tagIndex) => ({
            project_id: project.id,
            tag,
            sort_order: tagIndex,
          }));
        }
      );

      if (tagRows.length > 0) {
        const { error: insertTagsError } = await supabase
          .from("project_tags")
          .insert(tagRows);

        if (insertTagsError) {
          return respondSupabaseError("update project tags", insertTagsError);
        }
      }
    }

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
