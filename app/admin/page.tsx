"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

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

export default function AdminPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [data, setData] = useState<PortfolioData>({
    name: "",
    title: "",
    about: [""],
    projects: [],
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const result = await response.json();

      if (result.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_authenticated", "true");
        sessionStorage.setItem("admin_password", password);
        loadData();
      } else {
        setAuthError(result.error || "認証に失敗しました");
      }
    } catch (error) {
      setAuthError("認証エラーが発生しました");
    }
  };

  const loadData = () => {
    setLoading(true);
    fetch("/api/portfolio")
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to load data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // セッションストレージで認証状態を確認
    const authenticated = sessionStorage.getItem("admin_authenticated");
    const savedPassword = sessionStorage.getItem("admin_password");
    if (authenticated === "true" && savedPassword) {
      setPassword(savedPassword);
      setIsAuthenticated(true);
      loadData();
    }
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("保存しました！");
        router.push("/");
      } else {
        const result = await response.json();
        if (result.type === "auth") {
          alert("認証エラー: セッションが切れました。再ログインしてください。");
          sessionStorage.removeItem("admin_password");
          setPassword("");
          setIsAuthenticated(false);
          sessionStorage.removeItem("admin_authenticated");
        } else {
          alert(`保存に失敗しました: ${result.error}`);
        }
      }
    } catch (error) {
      alert("保存に失敗しました");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const addAboutParagraph = () => {
    setData({ ...data, about: [...data.about, ""] });
  };

  const removeAboutParagraph = (index: number) => {
    const newAbout = data.about.filter((_, i) => i !== index);
    setData({ ...data, about: newAbout });
  };

  const updateAboutParagraph = (index: number, value: string) => {
    const newAbout = [...data.about];
    newAbout[index] = value;
    setData({ ...data, about: newAbout });
  };

  const addProject = () => {
    setData({
      ...data,
      projects: [
        ...data.projects,
        { title: "", description: "", tags: [] },
      ],
    });
  };

  const removeProject = (index: number) => {
    const newProjects = data.projects.filter((_, i) => i !== index);
    setData({ ...data, projects: newProjects });
  };

  const updateProject = (index: number, field: keyof Project, value: any) => {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    setData({ ...data, projects: newProjects });
  };

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-zinc-900">
          <h1 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            管理画面ログイン
          </h1>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                パスワード
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                placeholder="パスワードを入力"
                required
              />
            </div>
            {authError && (
              <p className="mb-4 text-sm text-red-500">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
            >
              ログイン
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p>読み込み中...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-8">
      <div className="mx-auto max-w-4xl px-6">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            管理画面
          </h1>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-zinc-200 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-300 dark:bg-zinc-800 dark:text-zinc-50 dark:hover:bg-zinc-700"
          >
            サイトを表示
          </button>
        </div>

        <div className="space-y-8">
          {/* 基本情報 */}
          <section className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
            <h2 className="mb-4 text-xl font-bold text-zinc-900 dark:text-zinc-50">
              基本情報
            </h2>
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  名前
                </label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  肩書き
                </label>
                <input
                  type="text"
                  value={data.title}
                  onChange={(e) => setData({ ...data, title: e.target.value })}
                  className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                />
              </div>
            </div>
          </section>

          {/* 自己紹介 */}
          <section className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                自己紹介
              </h2>
              <button
                onClick={addAboutParagraph}
                className="rounded-lg bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
              >
                段落を追加
              </button>
            </div>
            <div className="space-y-4">
              {data.about.map((paragraph, index) => (
                <div key={index} className="flex gap-2">
                  <textarea
                    value={paragraph}
                    onChange={(e) =>
                      updateAboutParagraph(index, e.target.value)
                    }
                    rows={3}
                    className="flex-1 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                    placeholder="自己紹介文を入力..."
                  />
                  {data.about.length > 1 && (
                    <button
                      onClick={() => removeAboutParagraph(index)}
                      className="rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                    >
                      削除
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* プロジェクト */}
          <section className="rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">
                プロジェクト
              </h2>
              <button
                onClick={addProject}
                className="rounded-lg bg-blue-500 px-3 py-1 text-sm font-medium text-white hover:bg-blue-600"
              >
                プロジェクトを追加
              </button>
            </div>
            <div className="space-y-6">
              {data.projects.map((project, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-700"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-50">
                      プロジェクト {index + 1}
                    </h3>
                    <button
                      onClick={() => removeProject(index)}
                      className="rounded-lg bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                    >
                      削除
                    </button>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        タイトル
                      </label>
                      <input
                        type="text"
                        value={project.title}
                        onChange={(e) =>
                          updateProject(index, "title", e.target.value)
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        説明
                      </label>
                      <textarea
                        value={project.description}
                        onChange={(e) =>
                          updateProject(index, "description", e.target.value)
                        }
                        rows={3}
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                        タグ（カンマ区切り）
                      </label>
                      <input
                        type="text"
                        value={project.tags.join(", ")}
                        onChange={(e) =>
                          updateProject(
                            index,
                            "tags",
                            e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag)
                          )
                        }
                        className="w-full rounded-lg border border-zinc-300 bg-white px-4 py-2 text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-50"
                        placeholder="例: Next.js, TypeScript, React"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 保存ボタン */}
          <div className="flex justify-end gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-green-500 px-6 py-3 font-medium text-white hover:bg-green-600 disabled:bg-gray-400"
            >
              {saving ? "保存中..." : "保存する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
