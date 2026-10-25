// IMPORTANT: After any .env.local change, restart with Ctrl+C then npm run dev
// Environment variables are only loaded at server start

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export const maxDuration = 60
export const dynamic = 'force-dynamic'

function isOriginAllowed(origin, req) {
  if (!origin) return true

  const originClean = origin.trim().replace(/\/$/, '')
  const host = req.headers.get('host')
  const forwardedHost = req.headers.get('x-forwarded-host')

  const allowed = new Set([
    'http://localhost:3000',
    'http://127.0.0.1:3000',
  ])

  if (process.env.NEXT_PUBLIC_BASE_URL) {
    allowed.add(process.env.NEXT_PUBLIC_BASE_URL.trim().replace(/\/$/, ''))
  }
  if (process.env.VERCEL_URL) {
    allowed.add(`https://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`)
    allowed.add(`http://${process.env.VERCEL_URL.trim().replace(/\/$/, '')}`)
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    allowed.add(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.trim().replace(/\/$/, '')}`)
  }
  if (host) {
    const hostClean = host.trim().replace(/\/$/, '')
    allowed.add(`http://${hostClean}`)
    allowed.add(`https://${hostClean}`)
  }
  if (forwardedHost) {
    const fHostClean = forwardedHost.trim().replace(/\/$/, '')
    allowed.add(`http://${fHostClean}`)
    allowed.add(`https://${fHostClean}`)
  }

  if (allowed.has(originClean)) return true

  try {
    const url = new URL(originClean)
    if (url.hostname.endsWith('.vercel.app')) {
      return true
    }
  } catch {
    // Ignore invalid origin strings
  }

  return false
}

function getCorsHeaders(req) {
  const origin = req.headers.get('origin')

  const headers = {
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  }

  if (origin && isOriginAllowed(origin, req)) {
    headers['Access-Control-Allow-Origin'] = origin
    headers['Vary'] = 'Origin'
  }

  return headers
}

export async function OPTIONS(req) {
  const origin = req.headers.get('origin')

  if (origin && !isOriginAllowed(origin, req)) {
    return new Response(null, { status: 403 })
  }

  const headers = getCorsHeaders(req)
  return new Response(null, {
    status: 204,
    headers,
  })
}

export async function POST(req) {
  const origin = req.headers.get('origin')

  if (origin && !isOriginAllowed(origin, req)) {
    return NextResponse.json({ error: 'Origin not allowed' }, { status: 403 })
  }

  const corsHeaders = getCorsHeaders(req)
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY)
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in .env.local')
      return NextResponse.json(
        { error: 'Gemini API key not configured' }, 
        { status: 500, headers: corsHeaders }
      )
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' }, 
        { status: 400, headers: corsHeaders }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const generationConfig = {
      responseMimeType: 'application/json',
      temperature: 0.1,
      topP: 0.8,
      topK: 20,
    }
    let text = ''

    // Model fallback chain: verified production models for Gemini API
    const modelsToTry = ['gemini-2.5-flash', 'gemini-2.5-flash-lite']
    let lastError = null

    for (const modelName of modelsToTry) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName, generationConfig })
        const result = await model.generateContent(prompt)
        text = result.response.text()
        if (text) break
      } catch (err) {
        lastError = err
        console.warn(`${modelName} generation failed, attempting next model:`, err.message)
      }
    }

    if (!text && lastError) {
      throw lastError
    }

    console.log('Gemini response received, length:', text.length)

    return NextResponse.json({ result: text }, { headers: corsHeaders })

  } catch (error) {
    console.error('Gemini API error:', error.message)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500, headers: corsHeaders }
    )
  }
}
