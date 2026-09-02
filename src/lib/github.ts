import { GITHUB_USER } from "@/i18n/dictionaries";

export interface Repo {
  name: string;
  description: string | null;
  language: string | null;
  url: string;
  homepage: string | null;
  /** ISO timestamp of the last push, formatted in the reader's locale. */
  updated: string;
}

interface GitHubRepo {
  name: string;
  description: string | null;
  language: string | null;
  html_url: string;
  homepage: string | null;
  pushed_at: string;
  fork: boolean;
  private: boolean;
}

/* ---------------------------------------------------------------------------
   The project list is the GitHub account, read at build time and refreshed
   hourly, so pushing a new repository puts it on the site without a code
   change here.

   Unauthenticated requests are rate limited per IP. A miss returns an empty
   list rather than throwing, and the section falls back to a direct link, so
   a throttled build never takes the page down.
--------------------------------------------------------------------------- */
export async function getRepos(): Promise<Repo[]> {
  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`,
      {
        headers: {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as GitHubRepo[])
      .filter(
        (repo) =>
          !repo.fork &&
          !repo.private &&
          // The repo named after the account holds the GitHub profile readme,
          // not a project.
          repo.name.toLowerCase() !== GITHUB_USER.toLowerCase()
      )
      .map((repo) => ({
        name: repo.name,
        description: repo.description,
        language: repo.language,
        url: repo.html_url,
        homepage: repo.homepage?.trim() ? repo.homepage.trim() : null,
        updated: repo.pushed_at,
      }))
      .sort((a, b) => b.updated.localeCompare(a.updated));
  } catch {
    return [];
  }
}
