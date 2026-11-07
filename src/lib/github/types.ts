export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  description: string | null;
  htmlUrl: string;
  homepageUrl: string | null;
  stars: number;
  forks: number;
  language: string | null;
  topics: string[];
  updatedAt: string;
  pushedAt: string;
  category: 'Full Stack' | 'Mobile' | 'AI / ML' | 'Systems' | 'Tools';
  isVerifiedPortfolioProject?: boolean;
  highlights?: string[];
}

export interface GitHubProfileStats {
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  profileUrl: string;
  publicReposCount: number;
  followersCount: number;
  followingCount: number;
  topLanguages: { name: string; count: number; percentage: number; color: string }[];
  categories: { name: string; count: number }[];
  verifiedShowcaseRepos: GitHubRepo[];
}

