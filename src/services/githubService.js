export async function fetchGitHubProfile(username) {
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'http://127.0.0.1:3000';
  const response = await fetch(`${baseUrl}/api/github?username=${encodeURIComponent(username)}`);

  if (response.status === 404) {
    throw new Error('USER_NOT_FOUND');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    if (errorData.error === 'NO_REPOS') {
      throw new Error('NO_REPOS');
    }
    if (errorData.error === 'RATE_LIMIT_EXCEEDED') {
      throw new Error('RATE_LIMIT_EXCEEDED');
    }
    throw new Error('GITHUB_API_ERROR');
  }

  return response.json();
}
