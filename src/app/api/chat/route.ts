import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI with environment variable
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    try {
      // Get the model
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      // Generate response
      const result = await model.generateContent({
        contents: [{
          role: 'user',
          parts: [{
            text: message
          }]
        }]
      });
      
      const response = await result.response;
      const text = response.text();

      return NextResponse.json({ response: text });
    } catch (aiError) {
      console.error('AI service error:', aiError);
      return NextResponse.json({ error: 'Failed to generate response' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error in chat API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 