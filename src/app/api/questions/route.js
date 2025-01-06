import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import easyQuestions from './Easy.json';
import mediumQuestions from './Medium.json';
import hardQuestions from './Hard.json';

const questionsMap = {
  easy: easyQuestions.questions,
  medium: mediumQuestions.questions,
  hard: hardQuestions.questions,
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');

  if (!type || !questionsMap[type]) {
    return NextResponse.json({ error: 'Valid quiz type is required (easy, medium, hard)' }, { status: 400 });
  }

  // Get the file name from the mapping
  const fileName = questionsMap[type];
  const filePath = path.join(process.cwd(), 'src/app/api/questions', fileName);

  try {
    await fs.access(filePath); // Check if the file exists
  } catch (error) {
    console.error(`File not found: ${filePath}`);
    return NextResponse.json({ error: 'Questions not found for this type' }, { status: 404 });
  }

  try {
    const fileContents = await fs.readFile(filePath, 'utf8'); // Read the file
    const data = JSON.parse(fileContents); // Parse the JSON

    if (!data.questions || !Array.isArray(data.questions)) {
      console.error('Invalid questions data structure');
      return NextResponse.json({ error: 'Invalid questions data' }, { status: 500 });
    }

    return NextResponse.json(data.questions); // Return the questions
  } catch (error) {
    console.error('Error reading or parsing questions file:', error);
    return NextResponse.json({ error: 'Failed to load questions' }, { status: 500 });
  }
}
