/**
 * Roadmap Registry for roadmap.sh slugs and verified URLs
 * Whitelist used to validate LLM-generated roadmap URLs and prevent 404s.
 */

export const ROADMAP_URLS = {
  'frontend': 'https://roadmap.sh/frontend',
  'backend': 'https://roadmap.sh/backend',
  'full-stack': 'https://roadmap.sh/full-stack',
  'devops': 'https://roadmap.sh/devops',
  'ai-data-scientist': 'https://roadmap.sh/ai-data-scientist',
  'ai-engineer': 'https://roadmap.sh/ai-engineer',
  'data-analyst': 'https://roadmap.sh/data-analyst',
  'android': 'https://roadmap.sh/android',
  'ios': 'https://roadmap.sh/ios',
  'qa': 'https://roadmap.sh/qa',
  'ux-design': 'https://roadmap.sh/ux-design',
  'cyber-security': 'https://roadmap.sh/cyber-security',
  'blockchain': 'https://roadmap.sh/blockchain',
  'software-architect': 'https://roadmap.sh/software-architect',
  'software-design': 'https://roadmap.sh/software-design',
  'system-design': 'https://roadmap.sh/system-design',
  'python': 'https://roadmap.sh/python',
  'java': 'https://roadmap.sh/java',
  'golang': 'https://roadmap.sh/golang',
  'rust': 'https://roadmap.sh/rust',
  'javascript': 'https://roadmap.sh/javascript',
  'typescript': 'https://roadmap.sh/typescript',
  'react': 'https://roadmap.sh/react',
  'vue': 'https://roadmap.sh/vue',
  'angular': 'https://roadmap.sh/angular',
  'nodejs': 'https://roadmap.sh/nodejs',
  'aspnet-core': 'https://roadmap.sh/aspnet-core',
  'flutter': 'https://roadmap.sh/flutter',
  'react-native': 'https://roadmap.sh/react-native',
  'docker': 'https://roadmap.sh/docker',
  'kubernetes': 'https://roadmap.sh/kubernetes',
  'aws': 'https://roadmap.sh/aws',
  'mlops': 'https://roadmap.sh/mlops',
  'prompt-engineering': 'https://roadmap.sh/prompt-engineering',
  'computer-science': 'https://roadmap.sh/computer-science',
  'engineering-manager': 'https://roadmap.sh/engineering-manager',
  'technical-writer': 'https://roadmap.sh/technical-writer',
  'sql': 'https://roadmap.sh/sql',
  'postgresql': 'https://roadmap.sh/postgresql',
  'mongodb': 'https://roadmap.sh/mongodb',
  'redis': 'https://roadmap.sh/redis',
  'graphql': 'https://roadmap.sh/graphql'
}

/**
 * Validates and normalizes roadmap data against ROADMAP_URLS whitelist.
 * Returns a new normalized roadmap object without mutating the original input.
 * Fuzzy-matches on targetRole if URL does not directly match, and preserves
 * the original targetRole even when assigning fallback URLs.
 */
export function validateAndNormalizeRoadmap(roadmap) {
  if (!roadmap || typeof roadmap !== 'object') {
    return {
      targetRole: 'Full-Stack Developer',
      roadmapUrl: ROADMAP_URLS['full-stack'],
      months: []
    }
  }

  const rawUrl = (roadmap.roadmapUrl || '').trim()
  const rawTargetRole = (roadmap.targetRole || '').trim()

  let matchedKey = null

  const cleanUrl = rawUrl.split('?')[0].split('#')[0]

  // 1. Direct slug or path extraction: strip domain, protocol, slashes
  const normalizedSlug = cleanUrl
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?roadmap\.sh\/?/, '')
    .replace(/\/+$/, '')

  const slugAliases = {
    'fullstack': 'full-stack',
    'front-end': 'frontend',
    'back-end': 'backend',
    'ux-designer': 'ux-design',
    'ui-ux': 'ux-design',
    'ui-ux-design': 'ux-design',
    'data-science': 'ai-data-scientist',
    'machine-learning': 'ai-data-scientist',
    'ml': 'ai-data-scientist',
    'ai': 'ai-engineer',
    'ai-developer': 'ai-engineer',
    'cybersecurity': 'cyber-security',
    'infosec': 'cyber-security',
    'cloud': 'devops',
    'sre': 'devops',
    'software-architecture': 'software-architect',
    'systems-design': 'system-design'
  }

  if (ROADMAP_URLS[normalizedSlug]) {
    matchedKey = normalizedSlug
  } else if (slugAliases[normalizedSlug] && ROADMAP_URLS[slugAliases[normalizedSlug]]) {
    matchedKey = slugAliases[normalizedSlug]
  } else {
    // 2. Check full URL matches
    for (const [key, url] of Object.entries(ROADMAP_URLS)) {
      if (cleanUrl.toLowerCase() === url.toLowerCase()) {
        matchedKey = key
        break
      }
    }
  }

  // 3. Fuzzy-match on targetRole if URL did not match
  if (!matchedKey && rawTargetRole) {
    const cleanRole = rawTargetRole.toLowerCase()
    
    // Check common role aliases
    const roleAliases = {
      'frontend': ['front-end', 'frontend', 'front end', 'react', 'vue', 'angular', 'ui developer', 'web developer'],
      'backend': ['back-end', 'backend', 'back end', 'api developer', 'server', 'node'],
      'full-stack': ['fullstack', 'full-stack', 'full stack', 'mern', 'mean'],
      'devops': ['devops', 'sre', 'site reliability', 'cloud', 'infrastructure', 'platform engineer'],
      'ai-engineer': ['ai engineer', 'artificial intelligence', 'genai', 'llm'],
      'ai-data-scientist': ['data scientist', 'data science', 'machine learning', 'ml engineer', 'deep learning'],
      'data-analyst': ['data analyst', 'data analytics', 'business analyst'],
      'ux-design': ['ux', 'ui/ux', 'ui designer', 'product designer', 'ux designer', 'user experience'],
      'cyber-security': ['cyber security', 'infosec', 'security engineer', 'penetration tester', 'cybersecurity'],
      'qa': ['qa', 'quality assurance', 'test engineer', 'automation tester', 'sdet'],
      'system-design': ['system design', 'systems design'],
      'software-architect': ['architect', 'solutions architect', 'software architect'],
      'android': ['android'],
      'ios': ['ios', 'swift', 'apple'],
      'blockchain': ['blockchain', 'web3', 'crypto', 'solidity'],
      'python': ['python developer', 'python engineer'],
      'java': ['java developer', 'java engineer'],
      'golang': ['golang', 'go developer', 'go engineer'],
      'rust': ['rust developer', 'rust engineer'],
    }

    for (const [key, aliases] of Object.entries(roleAliases)) {
      if (aliases.some(alias => cleanRole.includes(alias))) {
        matchedKey = key
        break
      }
    }

    // Direct key matching against ROADMAP_URLS keys
    if (!matchedKey) {
      for (const key of Object.keys(ROADMAP_URLS)) {
        const keyParts = key.split('-')
        if (keyParts.every(part => cleanRole.includes(part))) {
          matchedKey = key
          break
        }
      }
    }
  }

  // Determine final roadmap URL: matched URL or fallback
  const finalUrl = matchedKey ? ROADMAP_URLS[matchedKey] : ROADMAP_URLS['full-stack']
  
  // Preserve targetRole when fallback URLs are assigned (default to fallback role only if targetRole was not provided)
  const finalTargetRole = rawTargetRole || 'Full-Stack Developer'

  return {
    ...roadmap,
    targetRole: finalTargetRole,
    roadmapUrl: finalUrl,
    months: Array.isArray(roadmap.months) ? [...roadmap.months] : []
  }
}
