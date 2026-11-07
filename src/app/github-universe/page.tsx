import { Metadata } from 'next';
import { GithubUniverseView } from '@/components/github-universe/GithubUniverseView';
import { getGitHubProfileData } from '@/lib/github/githubService';

export const metadata: Metadata = {
  title: 'GitHub Code Nexus // Abhishek S Nair',
  description:
    'Interactive animated GitHub profile assembly, live repository explorer, and architecture network visualization by Abhishek S Nair.',
  openGraph: {
    title: 'GitHub Code Nexus // Abhishek S Nair',
    description:
      'Interactive animated GitHub profile assembly, live repository explorer, and architecture network visualization by Abhishek S Nair.',
    images: ['/profile.webp'],
  },
};

export default async function GithubUniversePage() {
  const profileData = await getGitHubProfileData();
  return <GithubUniverseView initialData={profileData} />;
}

