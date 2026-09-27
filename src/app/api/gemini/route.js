// IMPORTANT: After any .env.local change, restart with Ctrl+C then npm run dev
// Environment variables are only loaded at server start

import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextResponse } from 'next/server'

export async function POST(req) {
  console.log('GEMINI_API_KEY present:', !!process.env.GEMINI_API_KEY)
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      console.error('GEMINI_API_KEY is not set in .env.local')
      return NextResponse.json(
        { error: 'Gemini API key not configured' }, 
        { status: 500 }
      )
    }

    const { prompt } = await req.json()

    if (!prompt) {
      return NextResponse.json(
        { error: 'No prompt provided' }, 
        { status: 400 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    let text = ''
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' })
      const result = await model.generateContent(prompt)
      text = result.response.text()
    } catch (primaryErr) {
      console.warn('gemini-3.8-flash error, trying gemini-2.5-flash fallback:', primaryErr.message)
      const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
      const result = await fallbackModel.generateContent(prompt)
      text = result.response.text()
    }

    console.log('Gemini response received, length:', text.length)

    return NextResponse.json({ result: text })

  } catch (error) {
    console.error('Gemini API error:', error.message)
    return NextResponse.json(
      { error: error.message }, 
      { status: 500 }
    )
  }
}
