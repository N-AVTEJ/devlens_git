import { Inter, JetBrains_Mono, Manrope } from 'next/font/google'
import './globals.css'
import ClientVisuals from '../components/ClientVisuals'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans'
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'], 
  variable: '--font-mono' 
})

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope'
})

export const metadata = {
  title: 'DevLens AI — Hackathon Career Intelligence Platform',
  description: 'Turn your skills into career intelligence with real-time GitHub scanning and personality-based role matching.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} ${manrope.variable}`}>
      <body className="bg-black text-white font-sans antialiased min-h-screen relative">
        <ClientVisuals />
        {children}
      </body>
    </html>
  )
}
