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
 * Overwrites invalid URLs with safe fallback ('full-stack') and aligns targetRole.
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

  let matchedKey = null

  // 1. Direct slug or path extraction: strip domain, protocol, slashes
  const normalizedSlug = rawUrl
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?roadmap\.sh\/?/, '')
    .replace(/\/$/, '')

  if (ROADMAP_URLS[normalizedSlug]) {
    matchedKey = normalizedSlug
  } else {
    // 2. Check full URL matches
    for (const [key, url] of Object.entries(ROADMAP_URLS)) {
      if (rawUrl.toLowerCase() === url.toLowerCase()) {
        matchedKey = key
        break
      }
    }
  }

  if (matchedKey) {
    roadmap.roadmapUrl = ROADMAP_URLS[matchedKey]
  } else {
    // Fallback safe normalization per requirement
    roadmap.roadmapUrl = ROADMAP_URLS['full-stack']
    roadmap.targetRole = 'Full-Stack Developer'
  }

  return roadmap
}
