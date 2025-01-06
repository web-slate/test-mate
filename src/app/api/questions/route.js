import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type')

  if (!type) {
    return NextResponse.json({ error: 'Quiz type is required' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), `./data/${type}.json`)

  try {
    await fs.access(filePath)
  } catch (error) {
    console.error(`File not found: ${filePath}`)
    return NextResponse.json({ error: 'Questions not found for this type' }, { status: 404 })
  }

  try {
    const fileContents = await fs.readFile(filePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    if (!data.questions || !Array.isArray(data.questions)) {
      console.error('Invalid questions data structure')
      return NextResponse.json({ error: 'Invalid questions data' }, { status: 500 })
    }

    return NextResponse.json(data.questions)
  } catch (error) {
    console.error('Error reading or parsing questions file:', error)
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 })
  }
}

