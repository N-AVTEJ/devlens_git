// IMPORTANT: After any .env.local change, restart with Ctrl+C then npm run dev
// Environment variables are only loaded at server start

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function POST(req) {
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

    // Note: gemini-3.8-flash may not be a valid model ID — verify against the current Gemini API model list before deploying; if invalid, remove it from the fallback chain entirely so we don't waste a failed round-trip on every single request.
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash', generationConfig })
      const result = await model.generateContent(prompt)
      text = result.response.text()
    } catch (primaryErr) {
      console.warn('gemini-3.8-flash error, trying gemini-2.5-flash fallback:', primaryErr.message)
      try {
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash', generationConfig })
        const result = await fallbackModel.generateContent(prompt)
        text = result.response.text()
      } catch (secondaryErr) {
        console.warn('gemini-2.5-flash error, trying gemini-flash-latest fallback:', secondaryErr.message)
        const tertiaryModel = genAI.getGenerativeModel({ model: 'gemini-flash-latest', generationConfig })
        const result = await tertiaryModel.generateContent(prompt)
        text = result.response.text()
      }
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
