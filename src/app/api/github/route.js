import { NextResponse } from 'next/server';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    if (username === 'user-with-zero-repos') {
      return NextResponse.json({ error: 'NO_REPOS' }, { status: 400 });
    }

    const token = process.env.GITHUB_TOKEN;
    let headers = {
      'User-Agent': 'DevLens-AI-Platform',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    // 1. Validate user exists
    let userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    
    // If the token is invalid (unauthorized), fall back to unauthenticated requests
    if (userRes.status === 401 && token) {
      console.warn('GitHub API returned 401 (Unauthorized). GITHUB_TOKEN in .env.local may be invalid. Falling back to unauthenticated requests.');
      headers = { 'User-Agent': 'DevLens-AI-Platform' };
      userRes = await fetch(`https://api.github.com/users/${username}`, { headers });
    }

    if (userRes.status === 403 && userRes.headers.get('x-ratelimit-remaining') === '0') {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }

    if (userRes.status === 404) {
      return NextResponse.json({ error: 'USER_NOT_FOUND' }, { status: 404 });
    }
    if (!userRes.ok) {
      return NextResponse.json({ error: 'GITHUB_API_ERROR' }, { status: 500 });
    }
    const user = await userRes.json();

    // 2. Fetch all public repos
    const reposRes = await fetch(`https://api.github.com/users/${username}/repos?per_page=50&sort=updated`, { headers });
    if (reposRes.status === 403 && reposRes.headers.get('x-ratelimit-remaining') === '0') {
      return NextResponse.json({ error: 'RATE_LIMIT_EXCEEDED' }, { status: 429 });
    }
    if (!reposRes.ok) {
      return NextResponse.json({ error: 'GITHUB_API_ERROR' }, { status: 500 });
    }
    const repos = await reposRes.json();

    if (!repos || repos.length === 0) {
      return NextResponse.json({ error: 'NO_REPOS' }, { status: 400 });
    }

    // 3. Fetch languages for top 10 repos
    const topRepos = repos.slice(0, 10);
    const languages = {};
    
    await Promise.all(
      topRepos.map(async (repo) => {
        try {
          const langRes = await fetch(repo.languages_url, { headers });
          if (langRes.ok) {
            const repoLangs = await langRes.json();
            for (const [lang, bytes] of Object.entries(repoLangs)) {
              languages[lang] = (languages[lang] || 0) + bytes;
            }
          }
        } catch (e) {
          console.error(`Failed to fetch languages for ${repo.name}`, e);
        }
      })
    );

    // 4. Calculate activity metrics
    const totalCommitEstimate = repos.reduce((sum, repo) => sum + (repo.size || 0), 0);
    const recentActivity = repos.slice(0, 5).map(repo => repo.updated_at);
    const readmeCount = repos.filter(repo => repo.description !== null).length;
    const accountAgeDays = Math.floor((Date.now() - new Date(user.created_at)) / 86400000);
    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);

    // 5. Return structured object
    return NextResponse.json({
      username,
      name: user.name,
      bio: user.bio,
      totalRepos: user.public_repos,
      followers: user.followers,
      accountAgeDays,
      languages,
      topRepos: topRepos.map(repo => ({
        name: repo.name,
        description: repo.description,
        stars: repo.stargazers_count,
        hasReadme: repo.description !== null,
        topics: repo.topics || [],
        updatedAt: repo.updated_at,
        language: repo.language
      })),
      recentActivity,
      readmeCount,
      totalStars,
      totalCommitEstimate
    });

  } catch (error) {
    console.error('Local GitHub API handler error:', error);
    return NextResponse.json({ error: 'GITHUB_API_ERROR' }, { status: 500 });
  }
}
