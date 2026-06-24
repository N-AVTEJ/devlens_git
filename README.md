# 🔍 DevLens AI — Career Intelligence Platform

[![Next.js](https://img.shields.io/badge/Next.js-15.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-blue?style=for-the-badge&logo=google-gemini&logoColor=white)](https://deepmind.google/technologies/gemini/)
[![Three.js](https://img.shields.io/badge/Three.js-r184-black?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-green?style=for-the-badge&logo=greensock)](https://gsap.com/)

DevLens AI is a state-of-the-art **Career Intelligence Platform** that helps developers, students, and tech newcomers identify their optimal engineering paths. By combining real-time **GitHub repo[...]" 

---

## 🚀 Key Features

### 1. ⚡ Real GitHub Analysis
* **Deep Scan**: Parses your public repositories, language distribution (in bytes), and commit activity metrics.
* **Smart Metrics**: Computes account age, repositories count, total stargazers, and documentation completeness.

### 2. 🌱 Career Interest Quiz (No-code Path)
* **Personality Survey**: An 8-question visual interest assessment designed for tech beginners.
* **Adaptive Matching**: Maps personal problem-solving preferences, tool interests, and workspace values to industry-standard developer roles.

### 3. 📊 Interactive Career Radar & Matches
* **6-Dimensional Capability Map**: Visualizes your proficiency across six domains: Frontend, Backend, DevOps, Data & ML, System Design, and Soft Skills using **Recharts Radar Charts**.
* **AI Match Coefficients**: Provides percentile matches for up to 5 career roles with specific database-backed reasoning.

### 4. 📈 Industry Readiness Score (0-100)
* **Performance Breakdown**: Evaluates your profile across four sub-metrics: consistency, project quality, skill diversity, and documentation.
* **Recruiter Persona Feedback**: Simulates the perspective of an expert tech recruiter to offer market-aligned career recommendations.

### 5. 🔥 Honest Roast Mode
* **Brutal AI Critique**: Delivers funny, punchy, and brutally honest critiques regarding missing tests, outdated code, commit gaps, and documentation deficiencies.

### 6. 🗺️ Month-by-Month Roadmaps
* **Actionable Learning Path**: Generates a tailored 5-month learning schedule complete with recommended tools and resources.
* **Direct Integration**: Points users straight to corresponding industry-standard paths on [roadmap.sh](https://roadmap.sh).

---

## 🛠️ Technology Stack

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 15.0 (App Router), React 19.0 | High-performance Server-Side Rendering (SSR) & routing |
| **AI Integration** | `@google/generative-ai` (Gemini 1.5 Flash) | AI profiling, career matching, and professional feedback |
| **API Integration** | GitHub REST API | Public profile fetching and repository data extraction |
| **3D & Visuals** | Three.js, `@react-three/fiber`, `@react-three/drei` | Immersive 3D interactive hero cards |
| **Animations** | GSAP (GreenSock), `@gsap/react`, Framer Motion | Smooth particle systems, glowing effects, and fluid scroll triggers |
| **Data Viz** | Recharts | Interactive SVG Skill Radar charts |
| **Styling** | Tailwind CSS v4.0 (using PostCSS) | Glassmorphic UI with vibrant cyberpunk accents |
| **Utility** | html2canvas | Allows users to screenshot and save their career report |

---

## 📂 Project Structure

```bash
devlens/
├── src/
│   ├── app/                      # Next.js App Router Page & API Routes
│   │   ├── analyze/              # Analysis path router (GitHub or Quiz Selection)
│   │   ├── api/
│   │   │   ├── gemini/           # POST endpoint communicating with Gemini API
│   │   │   └── github/           # GET endpoint querying GitHub REST API
│   │   ├── globals.css           # Tailwind configuration & global animations
│   │   ├── layout.jsx            # Core document structure
│   │   └── page.jsx              # Immersive interactive landing page
│   ├── components/               # Reusable React components
│   │   ├── CareerQuiz.jsx        # Interest quiz container & questions logic
│   │   ├── Dashboard.jsx         # Report visualization, radar charts, & roadmaps
│   │   ├── GitHubFlow.jsx        # Scanning & username inputs flow
│   │   ├── GlowCursor.jsx        # Cyberpunk particle mouse cursor effect
│   │   ├── HeroCard3D.jsx        # Interactive 3D component with React Three Fiber
│   │   ├── ParticleField.jsx     # Floating background particles canvas
│   │   │   ├── ScanSequence.jsx      # Retro loading terminal emulator
│   │   │   └── SkeletonDashboard.jsx # Dashboard loading visual feedback
│   ├── data/
│   │   └── quizQuestions.js      # Structured quiz payload data
│   ├── hooks/
│   │   ├── useGitHubAnalysis.js  # Manages GitHub fetch & Gemini profile analysis state
│   │   ├── useMagneticHover.js   # Interactive magnetic hover physics for buttons
│   │   └── useQuizAnalysis.js    # Manages quiz submission & response analysis
│   ├── services/
│   │   ├── geminiService.js      # Prompt engineering & JSON translation layer
│   │   ├── githubService.js      # Intermediary communication with Next.js GitHub API
│   │   └── quizService.js        # Formulates Gemini prompt for quiz analysis
│   └── tests/
│       └── backendTest.js        # Independent backend test runner suite
├── .env.local                    # Local environment secrets (ignored by git)
├── tailwind.config.js            # Design tokens & extended animations config
├── package.json                  # Scripts & dependencies definitions
└── README.md                     # Project documentation
```

---

## ⚙️ Installation & Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18.x or above) installed on your system.

### 1. Clone the Repository
```bash
git clone https://github.com/N-AVTEJ/devlens_git.git
cd devlens_git
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a file named `.env.local` in the root directory and add the following keys:
```env
# Google Gemini API key (Required for AI features)
GEMINI_API_KEY=your_gemini_api_key_here

# GitHub Personal Access Token (Optional, but recommended to avoid rate limits)
GITHUB_TOKEN=your_github_personal_access_token_here

# App Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```
> **Note**: You can get a Gemini API Key from the [Google AI Studio](https://aistudio.google.com/). You can generate a GitHub token under your GitHub Profile Developer settings (Settings -> Developer settings -> Personal access tokens).

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application in action.

---

## 🧪 Testing

The codebase comes equipped with a custom backend test suite located at `src/tests/backendTest.js`. It validates:
* GitHub API user fetching and error handling (`USER_NOT_FOUND`, `NO_REPOS`).
* Gemini API endpoint responses and JSON structure integrity.
* Quiz evaluation matching engine.

To run the backend test runner:
1. Ensure the dev server is active:
   ```bash
   npm run dev
   ```
2. In a separate terminal run:
   ```bash
   node src/tests/backendTest.js
   ```

---

## 🛡️ License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open a Pull Request or file an Issue.

1. Fork the Repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

*Built with 💚 and AI using Next.js, Tailwind, Three.js, and Google Gemini API.*
