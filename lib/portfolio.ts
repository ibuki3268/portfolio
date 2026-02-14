import "server-only";
import { getSupabaseServerClient } from "./supabase";

export type Project = {
  title: string;
  description: string;
  tags: string[];
};

export type PortfolioData = {
  name: string;
  title: string;
  about: string[];
  projects: Project[];
};

type SupabaseProjectTag = {
  tag: string | null;
  sort_order: number | null;
};

type SupabaseProject = {
  id: number;
  title: string | null;
  description: string | null;
  sort_order: number | null;
  tags: SupabaseProjectTag[] | null;
};

type SupabaseAbout = {
  content: string | null;
  sort_order: number | null;
};

type SupabasePortfolio = {
  id: number;
  name: string | null;
  title: string | null;
  abouts: SupabaseAbout[] | null;
  projects: SupabaseProject[] | null;
};

const PORTFOLIO_ID = 1;

export async function getPortfolioData(): Promise<PortfolioData | null> {
  const supabase = getSupabaseServerClient();

  const { data, error } = await supabase
    .from("portfolio")
    .select(
      `
      id,
      name,
      title,
      abouts:portfolio_abouts ( content, sort_order ),
      projects ( id, title, description, sort_order, tags:project_tags ( tag, sort_order ) )
    `
    )
    .eq("id", PORTFOLIO_ID)
    .single<SupabasePortfolio>();

  if (error || !data) {
    return null;
  }

  const about = (data.abouts ?? [])
    .slice()
    .sort(
      (a: SupabaseAbout, b: SupabaseAbout) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    .map((item: SupabaseAbout) => item.content ?? "");

  const projects = (data.projects ?? [])
    .slice()
    .sort(
      (a: SupabaseProject, b: SupabaseProject) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0)
    )
    .map((project: SupabaseProject) => ({
      title: project.title ?? "",
      description: project.description ?? "",
      tags: (project.tags ?? [])
        .slice()
        .sort(
          (a: SupabaseProjectTag, b: SupabaseProjectTag) =>
            (a.sort_order ?? 0) - (b.sort_order ?? 0)
        )
        .map((tag: SupabaseProjectTag) => tag.tag ?? ""),
    }));

  return {
    name: data.name ?? "",
    title: data.title ?? "",
    about,
    projects,
  };
}
