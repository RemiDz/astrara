import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'no key' })

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say hello in 5 words' }],
      }),
    })

    const data = await response.json()
    return NextResponse.json({ status: response.status, data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message })
  }
}
