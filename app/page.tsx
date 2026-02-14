import Link from "next/link";
import { getPortfolioData } from "@/lib/portfolio";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const data = (await getPortfolioData()) ?? {
    name: "",
    title: "",
    about: [],
    projects: [],
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
                {data.name}
              </h1>
              <p className="mt-2 text-lg text-zinc-600 dark:text-zinc-400">
                {data.title}
              </p>
            </div>
            <Link
              href="/admin"
              className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
            >
              管理画面
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-12">
        {/* About Section */}
        <section className="mb-16">
          <h2 className="mb-4 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            自己紹介
          </h2>
          <div className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
            {data.about.map((paragraph, index) => (
              <p
                key={index}
                className={`text-zinc-700 dark:text-zinc-300 leading-relaxed ${
                  index > 0 ? "mt-4" : ""
                }`}
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            プロジェクト
          </h2>
          <div className="grid gap-6">
            {data.projects.map((project, index) => (
              <div
                key={index}
                className="rounded-lg bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:bg-zinc-900"
              >
                <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                  {project.title}
                </h3>
                <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                  {project.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag, tagIndex) => (
                    <span
                      key={tagIndex}
                      className="rounded-full bg-zinc-100 px-3 py-1 text-sm text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto max-w-4xl px-6 py-8 text-center text-sm text-zinc-600 dark:text-zinc-400">
          <p>© 2026 {data.name}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
