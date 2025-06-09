import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { syncUser } from '@/lib/syncUser';
import { createChatSession } from '@/lib/createOrGetChatSession';
import { saveMessage } from '@/lib/saveMessage';

interface Auth0UserProfile {
  sub: string;
  email?: string;
  name?: string;
  picture?: string;
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { message, sessionId } = await req.json();
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Explicitly construct user object to match syncUser expected type
    const userProfile: Auth0UserProfile = {
      sub: session.user.sub,
      email: session.user.email || '',
      name: session.user.name || '',
      picture: session.user.picture || '',
    };

    // Sync user with Supabase
    const user = await syncUser(userProfile);

    // Create or get chat session
    let chatSessionId = sessionId;
    if (!chatSessionId) {
      const newSession = await createChatSession(user.id);
      chatSessionId = newSession.id;
    }

    // Save user message
    await saveMessage(chatSessionId, 'user', message);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GOOGLE_AI_API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message
                  }
                ]
              }
            ]
          })
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error:', errorData);
        throw new Error('Failed to generate response');
      }

      const data = await response.json();
      const text = data.candidates[0].content.parts[0].text;

      // Save assistant response
      await saveMessage(chatSessionId, 'assistant', text);

      return NextResponse.json({ 
        response: text,
        sessionId: chatSessionId
      });
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